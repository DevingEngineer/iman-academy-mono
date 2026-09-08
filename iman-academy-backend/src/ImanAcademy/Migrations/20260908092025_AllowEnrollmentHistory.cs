using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ImanAcademy.Migrations
{
    /// <inheritdoc />
    public partial class AllowEnrollmentHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Enrollments_ApplicationUserId_CourseId",
                table: "Enrollments");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_ApplicationUserId_CourseId",
                table: "Enrollments",
                columns: new[] { "ApplicationUserId", "CourseId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Enrollments_ApplicationUserId_CourseId",
                table: "Enrollments");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_ApplicationUserId_CourseId",
                table: "Enrollments",
                columns: new[] { "ApplicationUserId", "CourseId" },
                unique: true);
        }
    }
}
