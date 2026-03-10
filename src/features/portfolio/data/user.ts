import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Abtahi",
  lastName: "Shipar",
  displayName: "Abtahi Shipar",
  username: "theshipar",
  gender: "male",
  pronouns: "he/him",
  bio: "Senior UI UX Designer",
  flipSentences: ["Senior UI UX Designer", "Open Source Contributor"],
  address: "Bangladesh",
  phoneNumber: "Kzg4MDEzMDc2MDcwMTQ=",
  email: "YWJ0YWhpLnNoaXBhckBnbWFpbC5jb20=",
  website: "https://theshipar.com",
  behance: "https://www.behance.net/theshipar",
  jobTitle: "Senior UI UX Designer",
  jobs: [
    {
      title: "Senior UI UX Designer",
      company: "Vscale",
      website: "https://vscale.com",
      experienceId: "vscale",
    },
    {
      title: "Founder",
      company: "NerdLab",
      website: "https://nerdlab.com",
      experienceId: "nerdlab",
    },
  ],
  about: `
- **Design Engineer** with a passion for building beautiful and functional user interfaces.
- Focused on **React**, **Next.js**, and **TypeScript**.
`,
  avatar: "/images/theShipar.jpeg",
  ogImage: "/images/theShipar.jpeg",
  namePronunciationUrl: "",
  timeZone: "Asia/Dhaka",
  keywords: ["theshipar", "abtahi shipar", "abtahi", "shipar"],
  dateCreated: "2023-10-20", // YYYY-MM-DD
}
