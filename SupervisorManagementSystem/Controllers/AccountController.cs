using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace SupervisorManagementSystem.Controllers
{
    public class AccountController : Controller
    {
        private readonly string _connectionString = "Data Source=AFROZ;Initial Catalog=SupervisorDB;Integrated Security=True;TrustServerCertificate=True;";

        // GET: /Account/Login
        public IActionResult Login()
        {
            // If already logged in, redirect to home
            if (HttpContext.Session.GetString("SupervisorId") != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        // POST: /Account/Login
        [HttpPost]
        public IActionResult Login(string Email, string Password, bool RememberMe = false)
        {
            try
            {
                // Basic validation
                if (string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password))
                {
                    TempData["ErrorMessage"] = "Email and password are required";
                    return View();
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = @"
                        SELECT SupervisorId, FirstName, LastName, Email, MobileNumber 
                        FROM Supervisors 
                        WHERE Email = @Email AND Password = @Password AND IsActive = 1";

                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Email", Email.Trim());
                        command.Parameters.AddWithValue("@Password", Password);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // Login successful
                                int supervisorId = Convert.ToInt32(reader["SupervisorId"]);
                                string fullName = $"{reader["FirstName"]} {reader["LastName"]}";

                                // Store in session
                                HttpContext.Session.SetString("SupervisorId", supervisorId.ToString());
                                HttpContext.Session.SetString("FullName", fullName);
                                HttpContext.Session.SetString("Email", reader["Email"].ToString());
                                HttpContext.Session.SetString("Mobile", reader["MobileNumber"].ToString());

                                // If RememberMe is checked, set cookie (optional)
                                if (RememberMe)
                                {
                                    Response.Cookies.Append("SupervisorEmail", Email, new CookieOptions 
                                    {
                                        Expires = DateTime.Now.AddDays(30),
                                        HttpOnly = true
                                    });
                                } 

                                TempData["SuccessMessage"] = $"Welcome back, {reader["FirstName"]}!";
                                return RedirectToAction("Index", "Home");
                            }
                            else
                            {
                                TempData["ErrorMessage"] = "Invalid email or password";
                                return View();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Login failed. Please try again.";
                return View();
            }
        }

        // GET: /Account/Register
        public IActionResult Register()
        {
            return View();
        }

        // POST: /Account/Register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(
            string FirstName,
            string LastName,
            string Email,
            string Mobile,
            string AadharNumber,
            string Password,
            string ConfirmPassword)
        {
            try
            {
                // Get AgreeTerms from form - Checkbox के लिए
                string agreeTermsValue = Request.Form["AgreeTerms"];
                bool agreeTerms = (agreeTermsValue == "on" || agreeTermsValue == "true");

                // Validate required fields
                if (string.IsNullOrEmpty(FirstName) || FirstName.Length < 2)
                {
                    TempData["ErrorMessage"] = "First name must be at least 2 characters";
                    return View();
                }

                if (string.IsNullOrEmpty(LastName) || LastName.Length < 2)
                {
                    TempData["ErrorMessage"] = "Last name must be at least 2 characters";
                    return View();
                }

                // Validate email
                if (string.IsNullOrEmpty(Email) || !IsValidEmail(Email))
                {
                    TempData["ErrorMessage"] = "Please enter a valid email address";
                    return View();
                }

                // Validate mobile (10 digits)
                if (string.IsNullOrEmpty(Mobile) || Mobile.Length != 10 || !Mobile.All(char.IsDigit))
                {
                    TempData["ErrorMessage"] = "Mobile number must be 10 digits";
                    return View();
                }

                // Validate Aadhar (12 digits)
                string cleanAadhar = AadharNumber?.Replace(" ", "").Replace("-", "") ?? "";
                if (cleanAadhar.Length != 12 || !cleanAadhar.All(char.IsDigit))
                {
                    TempData["ErrorMessage"] = "Aadhar number must be 12 digits";
                    return View();
                }

                // Validate password
                if (string.IsNullOrEmpty(Password) || Password.Length < 6)
                {
                    TempData["ErrorMessage"] = "Password must be at least 6 characters";
                    return View();
                }

                if (Password != ConfirmPassword)
                {
                    TempData["ErrorMessage"] = "Passwords do not match";
                    return View();
                }

                // Check terms agreement
                if (!agreeTerms)
                {
                    TempData["ErrorMessage"] = "You must agree to the terms and conditions";
                    return View();
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    // Check for duplicate email
                    string checkEmailQuery = "SELECT COUNT(*) FROM Supervisors WHERE Email = @Email";
                    using (var checkEmailCmd = new SqlCommand(checkEmailQuery, connection))
                    {
                        checkEmailCmd.Parameters.AddWithValue("@Email", Email.Trim());
                        int emailCount = (int)checkEmailCmd.ExecuteScalar();

                        if (emailCount > 0)
                        {
                            TempData["ErrorMessage"] = "Email already registered";
                            return View();
                        }
                    }

                    // Check for duplicate mobile
                    string checkMobileQuery = "SELECT COUNT(*) FROM Supervisors WHERE MobileNumber = @Mobile";
                    using (var checkMobileCmd = new SqlCommand(checkMobileQuery, connection))
                    {
                        checkMobileCmd.Parameters.AddWithValue("@Mobile", Mobile);
                        int mobileCount = (int)checkMobileCmd.ExecuteScalar();

                        if (mobileCount > 0)
                        {
                            TempData["ErrorMessage"] = "Mobile number already registered";
                            return View();
                        }
                    }

                    // Check for duplicate Aadhar
                    string checkAadharQuery = "SELECT COUNT(*) FROM Supervisors WHERE AadharNumber = @Aadhar";
                    using (var checkAadharCmd = new SqlCommand(checkAadharQuery, connection))
                    {
                        checkAadharCmd.Parameters.AddWithValue("@Aadhar", cleanAadhar);
                        int aadharCount = (int)checkAadharCmd.ExecuteScalar();

                        if (aadharCount > 0)
                        {
                            TempData["ErrorMessage"] = "Aadhar number already registered";
                            return View();
                        }
                    }

                    // Insert new supervisor
                    string insertQuery = @"
                        INSERT INTO Supervisors 
                        (FirstName, LastName, Email, MobileNumber, AadharNumber, Password, CreatedDate, IsActive) 
                        VALUES (@FirstName, @LastName, @Email, @Mobile, @Aadhar, @Password, GETDATE(), 1)";

                    using (var insertCmd = new SqlCommand(insertQuery, connection))
                    {
                        insertCmd.Parameters.AddWithValue("@FirstName", FirstName.Trim());
                        insertCmd.Parameters.AddWithValue("@LastName", LastName.Trim());
                        insertCmd.Parameters.AddWithValue("@Email", Email.Trim());
                        insertCmd.Parameters.AddWithValue("@Mobile", Mobile);
                        insertCmd.Parameters.AddWithValue("@Aadhar", cleanAadhar);
                        insertCmd.Parameters.AddWithValue("@Password", Password);

                        int rowsAffected = insertCmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            TempData["SuccessMessage"] = "Registration successful! You can now login.";
                            return RedirectToAction("Login");
                        }
                        else
                        {
                            TempData["ErrorMessage"] = "Registration failed. Please try again.";
                            return View();
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                TempData["ErrorMessage"] = $"Database error: {sqlEx.Message}";
                return View();
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"An error occurred: {ex.Message}";
                return View();
            }
        }

        // GET: /Account/Logout
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            TempData["SuccessMessage"] = "You have been logged out successfully";
            return RedirectToAction("Login");
        }

        // GET: /Account/ForgotPassword
        public IActionResult ForgotPassword()
        {
            return View();
        }

        // POST: /Account/ForgotPassword
        [HttpPost]
        public IActionResult ForgotPassword(string Email)
        {
            try
            {
                if (string.IsNullOrEmpty(Email) || !IsValidEmail(Email))
                {
                    TempData["ErrorMessage"] = "Please enter a valid email address";
                    return View();
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = "SELECT COUNT(*) FROM Supervisors WHERE Email = @Email AND IsActive = 1";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Email", Email.Trim());
                        int count = (int)command.ExecuteScalar();

                        if (count > 0)
                        {
                            // In real application, send password reset email here
                            TempData["SuccessMessage"] = "Password reset instructions have been sent to your email.";
                        }
                        else
                        {
                            TempData["ErrorMessage"] = "Email not found in our system";
                        }
                    }
                }
                return View();
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "An error occurred. Please try again.";
                return View();
            }
        }

        // Helper method to validate email
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}