using Microsoft.EntityFrameworkCore;
using MistoGO.Data;

var builder = WebApplication.CreateBuilder(args);

// Додаємо підключення до MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 43));

builder.Services.AddDbContext<MistoGoContext>(options =>
    options.UseMySql(connectionString, serverVersion));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Додаємо CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://93.127.121.78:5173") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Використовуємо CORS
app.UseCors("AllowReact");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Додаємо головну сторінку
app.MapGet("/", () => new
{
    message = "MistoGO API",
    version = "1.0.0",
    documentation = "/swagger"
});

app.Run();