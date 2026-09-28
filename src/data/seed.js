// Sample data so the dashboard is useful on first load. Dates are relative
// to "today" so the charts always look current.
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const rows = [
  ["Stripe", "Frontend Engineer", "Dublin", "Hybrid", "LinkedIn", "Interview", 3, "65-80k", ["React", "TypeScript"]],
  ["Intercom", "Software Engineer, Web", "Dublin", "Hybrid", "Company site", "Applied", 5, "", ["React", "Ember"]],
  ["Workday", "UI Developer", "Dublin", "On-site", "Indeed", "Rejected", 30, "", ["JavaScript", "CSS"]],
  ["HubSpot", "Frontend Developer", "Dublin", "Hybrid", "Referral", "Offer", 26, "70k", ["React"]],
  ["Personio", "Frontend Engineer", "Remote", "Remote", "Arbeitnow", "Applied", 9, "", ["React", "GraphQL"]],
  ["Fenergo", "React Developer", "Dublin", "Hybrid", "IrishJobs", "Interview", 14, "55-65k", ["React", "Redux"]],
  ["Tines", "Product Engineer", "Dublin", "Hybrid", "LinkedIn", "Wishlist", 1, "", ["React", "Rails"]],
  ["Wayflyer", "Frontend Engineer", "Dublin", "Hybrid", "LinkedIn", "Applied", 12, "", ["React", "Next.js"]],
  ["Flipdish", "Web Developer", "Dublin", "Remote", "Indeed", "Rejected", 40, "", ["Vue", "JavaScript"]],
  ["Zendesk", "Frontend Engineer II", "Dublin", "Hybrid", "Company site", "Applied", 19, "", ["React", "Accessibility"]],
  ["Kitman Labs", "UI Engineer", "Dublin", "On-site", "IrishJobs", "Rejected", 35, "", ["React", "D3"]],
  ["Squarespace", "Software Engineer, Frontend", "Dublin", "Hybrid", "LinkedIn", "Interview", 21, "", ["React", "Performance"]],
  ["Globoforce", "JavaScript Developer", "Dublin", "Hybrid", "Indeed", "Applied", 24, "", ["JavaScript", "Node.js"]],
  ["Toast", "Frontend Engineer", "Dublin", "Hybrid", "Referral", "Wishlist", 2, "", ["React", "TypeScript"]],
  ["Version 1", "Graduate Web Developer", "Dublin", "On-site", "IrishJobs", "Applied", 44, "38k", ["HTML", "CSS"]],
  ["Datadog", "Software Engineer, Frontend", "Dublin", "Hybrid", "LinkedIn", "Rejected", 50, "", ["React", "Charts"]],
];

export const seedJobs = rows.map(([company, role, location, mode, source, status, ago, salary, tags], i) => ({
  id: `seed-${i + 1}`,
  company,
  role,
  location,
  mode,
  source,
  status,
  dateApplied: daysAgo(ago),
  salary,
  tags,
  url: "",
  notes: "",
  updatedAt: new Date().toISOString(),
}));
