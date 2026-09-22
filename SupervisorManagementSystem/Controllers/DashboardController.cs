using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models;
using SupervisorPortal.Services.Interfaces;
using System.Security.Claims;

namespace SupervisorPortal.Controllers
{
    public class DashboardController : Controller
    {
        private readonly SupervisorDbContext _context;
        private readonly ISupervisorService _supervisorService;

        public DashboardController(SupervisorDbContext context, ISupervisorService supervisorService)
        {
            _context = context;
            _supervisorService = supervisorService;
        }

        public IActionResult Index()
        {
            // Check if user is logged in
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("Email")))
            {
                return RedirectToAction("Login", "Account");
            }

            // Get supervisor ID from session
            var email = HttpContext.Session.GetString("Email");
            var supervisorId = _supervisorService.GetSupervisorIdByEmailAsync(email).Result;

            if (supervisorId == 0)
            {
                return RedirectToAction("Login", "Account"); 
            }

            // Pass session data to view
            ViewData["Email"] = HttpContext.Session.GetString("Email");
            ViewData["Aadhar"] = HttpContext.Session.GetString("Aadhar");
            ViewData["Mobile"] = HttpContext.Session.GetString("Mobile");
            ViewData["FullName"] = HttpContext.Session.GetString("FullName");

            // Check which steps are completed
            ViewBag.StepACompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "A").Result;
            ViewBag.StepBCompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "B").Result;
            ViewBag.StepCCompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "C").Result;
            ViewBag.StepDCompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "D").Result;
            ViewBag.StepECompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "E").Result;
            ViewBag.StepFCompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "F").Result;
            ViewBag.StepGCompleted = _supervisorService.IsStepCompletedAsync(supervisorId, "G").Result;

            // Get application status
            var application = _context.ApplicationSubmissions
                .FirstOrDefault(a => a.SupervisorId == supervisorId);

            ViewBag.ApplicationNumber = application?.ApplicationNumber;
            ViewBag.ApplicationStatus = application?.Status ?? "Not Submitted";

            return View();
        }

        [HttpPost]
        public IActionResult ShowStep(string step)
        {
            // Validate step
            var validSteps = new[] { "A", "B", "C", "D", "E", "F", "G" };
            if (!validSteps.Contains(step))
            {
                return Json(new { success = false, message = "Invalid step" });
            }

            // Check if user is logged in
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("Email")))
            {
                return Json(new { success = false, redirect = "/Account/Login" });
            }

            // Get supervisor ID
            var email = HttpContext.Session.GetString("Email");
            var supervisorId = _supervisorService.GetSupervisorIdByEmailAsync(email).Result;

            if (supervisorId == 0)
            {
                return Json(new { success = false, redirect = "/Account/Login" });
            }

            // Return step data
            return Json(new
            {
                success = true,
                step = step,
                supervisorId = supervisorId,
                email = email
            });
        }

        [HttpPost]
        public IActionResult Logout()
        {
            // Clear session
            HttpContext.Session.Clear();
            return Json(new { success = true, redirect = "/Account/Login" });
        }

        [HttpGet]
        public IActionResult GetSessionData()
        {
            var sessionData = new
            {
                Email = HttpContext.Session.GetString("Email"),
                Aadhar = HttpContext.Session.GetString("Aadhar"),
                Mobile = HttpContext.Session.GetString("Mobile"),
                FullName = HttpContext.Session.GetString("FullName")
            };

            return Json(sessionData);
        }

        [HttpGet]
        public IActionResult GetProgressStatus(int supervisorId)
        {
            try
            {
                var progress = new
                {
                    StepA = _supervisorService.IsStepCompletedAsync(supervisorId, "A").Result,
                    StepB = _supervisorService.IsStepCompletedAsync(supervisorId, "B").Result,
                    StepC = _supervisorService.IsStepCompletedAsync(supervisorId, "C").Result,
                    StepD = _supervisorService.IsStepCompletedAsync(supervisorId, "D").Result,
                    StepE = _supervisorService.IsStepCompletedAsync(supervisorId, "E").Result,
                    StepF = _supervisorService.IsStepCompletedAsync(supervisorId, "F").Result,
                    StepG = _supervisorService.IsStepCompletedAsync(supervisorId, "G").Result
                };

                return Json(new { success = true, progress });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}