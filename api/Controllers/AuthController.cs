using Microsoft.AspNetCore.Mvc;

namespace MistoGO.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register([FromBody] object request)
        {
            // TODO: Реалізувати реєстрацію
            return Ok(new { message = "Registration successful", userId = 1 });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] object request)
        {
            // TODO: Реалізувати авторизацію
            return Ok(new { message = "Login successful", userId = 1 });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // TODO: Реалізувати логаут
            return Ok(new { message = "Logout successful" });
        }
    }
}