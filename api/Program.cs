using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MistoGO.Data;
using MistoGO.Services;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Вибираємо connection string в залежності від середовища
var connectionString = builder.Environment.IsDevelopment() 
    ? builder.Configuration.GetConnectionString("LocalConnection")
    : builder.Configuration.GetConnectionString("DefaultConnection");

var serverVersion = new MySqlServerVersion(new Version(8, 0, 43));

builder.Services.AddDbContext<MistoGoContext>(options =>
    options.UseMySql(connectionString, serverVersion));

// Сервіси
builder.Services.AddScoped<ISupportService, SupportService>();
builder.Services.AddScoped<ILicenseService, LicenseService>();
builder.Services.AddScoped<EmailNotifier>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger з підтримкою файлів
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "MistoGO API", 
        Version = "v1" 
    });
    
    // Додаємо підтримку multipart/form-data для файлів
    c.OperationFilter<FileUploadOperationFilter>();
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(
                "https://mistogo.online",
                "https://www.mistogo.online",
                "http://93.127.121.78:5173",
                "http://localhost:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReact");
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => new
{
    message = "MistoGO API",
    version = "1.0.0",
    documentation = "/swagger",
    environment = builder.Environment.EnvironmentName,
    database = builder.Environment.IsDevelopment() ? "mistogo_local (dev)" : "mistogo (prod)"
});

app.Run();

// Swagger фільтр для підтримки IFormFile
public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParameters = context.MethodInfo.GetParameters()
            .Where(p => p.ParameterType == typeof(IFormFile))
            .ToList();

        if (!fileParameters.Any())
            return;

        // Очищаємо старі параметри
        operation.Parameters?.Clear();

        // Створюємо схему для multipart/form-data
        var uploadFileSchema = new OpenApiSchema
        {
            Type = "object",
            Properties = new Dictionary<string, OpenApiSchema>
            {
                ["file"] = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                }
            },
            Required = new HashSet<string> { "file" }
        };

        // Додаємо інші параметри з [FromForm]
        var otherFormParameters = context.MethodInfo.GetParameters()
            .Where(p => p.ParameterType != typeof(IFormFile) && 
                       p.GetCustomAttributes(typeof(FromFormAttribute), false).Any())
            .ToList();

        foreach (var param in otherFormParameters)
        {
            uploadFileSchema.Properties[param.Name!] = new OpenApiSchema
            {
                Type = param.ParameterType == typeof(long) || param.ParameterType == typeof(int) 
                    ? "integer" 
                    : "string"
            };
            uploadFileSchema.Required.Add(param.Name!);
        }

        operation.RequestBody = new OpenApiRequestBody
        {
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = uploadFileSchema
                }
            }
        };
    }
}