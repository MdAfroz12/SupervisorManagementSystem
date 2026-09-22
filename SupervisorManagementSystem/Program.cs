using Microsoft.EntityFrameworkCore;
using SupervisorPortal.Models;
using SupervisorPortal.Services;
using SupervisorPortal.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add Session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SupervisorDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Services (we'll create these next)
builder.Services.AddScoped<IFileUploadService, FileUploadService>();
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<ISupervisorService, SupervisorService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.UseSession();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();