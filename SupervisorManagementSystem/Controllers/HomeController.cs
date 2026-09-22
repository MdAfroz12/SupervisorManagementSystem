using Microsoft.AspNetCore.Mvc;

namespace SupervisorManagementSystem.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            // Check if user is logged in
            if (HttpContext.Session.GetString("SupervisorId") == null)
            {
                TempData["ErrorMessage"] = "Please login first";
                return RedirectToAction("Login", "Account");
            }

            // Pass user info to view
            ViewBag.FullName = HttpContext.Session.GetString("FullName");
            ViewBag.Email = HttpContext.Session.GetString("Email");

            return View();
        }
    }
} 