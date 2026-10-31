using System.ComponentModel.DataAnnotations;

namespace ImanAcademy.DTOs;

// ==================== READ (GET response) ====================
// Matches the "Course -> Module -> SubModule" tree UI exactly.

public class SyllabusTreeDto
{
    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public List<SyllabusModuleNodeDto> Modules { get; set; } = new();
}

public class SyllabusModuleNodeDto
{
    public Guid? ModuleId { get; set; }
    public Guid CourseId { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public int Order { get; set; }
    public List<SyllabusSubModuleNodeDto> SubModules { get; set; } = new();
}

public class SyllabusSubModuleNodeDto
{
    public Guid? SubModuleId { get; set; }
    public Guid? ModuleId { get; set; }
    public string SubModuleName { get; set; } = string.Empty;
    public int Order { get; set; }
}

// ==================== SYNC (PUT request) ====================
//
// Client sends the full desired end-state of the tree, in display order.
// The server diffs this against what's currently in the DB:
//   - Module/SubModule with a null/omitted Id, or an Id that doesn't match
//     anything on this course        -> created
//   - Module/SubModule with an Id matching an existing row               -> updated
//        (Title from payload, Order = its index in the payload list,
//         and for submodules, ModuleId = whatever module it's nested
//         under in the payload - this is how re-parenting works)
//   - Existing Module/SubModule whose Id is absent from the payload      -> deleted
//
// The whole thing is applied in a single transaction; the response is the
// resulting tree (with server-assigned Ids for anything newly created).

//public class SyllabusSyncDto
//{
//    // Omit or leave null to leave the course name unchanged.
//    [MaxLength(200)]
//    public string? CourseName { get; set; }

//    public List<SyllabusModuleSyncDto> Modules { get; set; } = new();
//}

//public class SyllabusModuleSyncDto
//{
//    // Null (or an Id not found on this course) = create a new module.
//    public Guid? Id { get; set; }

//    [Required, MaxLength(200)]
//    public string Title { get; set; } = string.Empty;

//    public List<SyllabusSubModuleSyncDto> SubModules { get; set; } = new();
//}

//public class SyllabusSubModuleSyncDto
//{
//    // Null (or an Id not found on this course) = create a new submodule.
//    public Guid? Id { get; set; }

//    [Required, MaxLength(200)]
//    public string Title { get; set; } = string.Empty;
//}