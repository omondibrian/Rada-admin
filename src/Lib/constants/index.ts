export default class TableNames {
  static sms = "SMS";
  static failedJobs = "Failed_Jobs";
  static region = "Region";
  static faculties = "Faculties";
  static help = "Help";
  static passwordResets = "Password_Resets";
  static eventLogs = "Event_Logs";
  static Mentorship_requests = "Mentorship_requests";
  static User = "User";
  static Country = "Country";
  static University = "University";
  static Campuses = "Campuses";
  static Roles = "Roles";
  static Admin_Users = "Admin_Users";
  static Mentorship = "Mentorship";
  static Categories = "Categories";
  static Sub_Categories = "Sub_Categories";
  static Message = "Message";
  static Issue_categories = "Issue_categories";
  static Mentor = "Mentor";
  static Contacts = "Contacts";
  static Map_Locations = "Map_Locations";
  static Groups = "Groups";
  static Sub_Sub_Categotries = "Sub_Sub_Categotries";
  static Student = 'Student';
  static Counselor = 'Counselor';
  static peerCounselor = 'peerCounselor';
  // static access_logs = "access_logs";
  static Data_types = "Data_types";
  static Contents = "Contents";
  // static Activity_logs = "Activity_logs";
  static News = "News";
  static NewsCategories = "NewsCategories";
}

export const orderedTables = [
  TableNames.failedJobs,
  TableNames.sms,
  TableNames.Mentorship_requests,
  TableNames.News,
  TableNames.Mentor,
  TableNames.Message,
  TableNames.Mentorship,
  TableNames.Contents,
  TableNames.Admin_Users,
  TableNames.Counselor,
  TableNames.peerCounselor,
  TableNames.Student,
  TableNames.help,
  TableNames.User,
  TableNames.eventLogs,
  TableNames.passwordResets,
  TableNames.Sub_Sub_Categotries,
  TableNames.Sub_Categories,
  TableNames.Categories,
  TableNames.NewsCategories,
  TableNames.Groups,
  TableNames.Map_Locations,
  TableNames.Contacts,
  // TableNames.access_logs,
  // TableNames.Activity_logs,
  TableNames.Data_types,
  TableNames.Issue_categories,
  TableNames.faculties,
  TableNames.Campuses,
  TableNames.University,
  TableNames.Country,
  TableNames.region,
  TableNames.Roles,
];
