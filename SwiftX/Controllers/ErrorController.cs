using Microsoft.AspNetCore.Mvc;

namespace SwiftX.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Error4xx()
            {
                return View();
            }
        public IActionResult Error5xx()
        {
            return View();
        }
        public IActionResult Maintenance()
        {
            return View();
        }
    }
}
