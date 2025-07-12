import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";

dotenv.config();

const demoUsers = [
  {
    username: "admin_user",
    name: "Admin User",
    email: "admin@skillswap.com",
    picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "admin",
    rating: 5.0,
    linkedinLink: "https://linkedin.com/in/admin-skillswap",
    githubLink: "https://github.com/admin-skillswap",
    portfolioLink: "https://admin-skillswap.tech",
    skillsProficientAt: ["System Administration", "User Management", "Security", "Analytics", "Leadership"],
    skillsToLearn: ["Advanced Analytics", "Machine Learning", "DevOps"],
    education: [
      {
        institution: "Admin University",
        degree: "Information Technology Management",
        startDate: new Date("2015-09-01"),
        endDate: new Date("2019-05-15"),
        score: 4.0,
        description: "Focused on system administration and user management"
      }
    ],
    bio: "System administrator with expertise in user management and platform security. Dedicated to maintaining a safe and productive learning environment.",
    projects: [
      {
        title: "Platform Security System",
        description: "Implemented comprehensive security measures for the SkillSwap platform",
        projectLink: "https://github.com/admin-skillswap/security-system",
        techStack: ["Security", "Analytics", "User Management"],
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-12-01")
      }
    ]
  },
  {
    username: "sarah_dev",
    name: "Sarah Johnson",
    email: "sarah.johnson@demo.com",
    picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    linkedinLink: "https://linkedin.com/in/sarah-johnson-dev",
    githubLink: "https://github.com/sarah-dev",
    portfolioLink: "https://sarah-johnson.dev",
    skillsProficientAt: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript"],
    skillsToLearn: ["Python", "Machine Learning", "Docker"],
    education: [
      {
        institution: "MIT",
        degree: "Computer Science",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2022-05-15"),
        score: 3.9,
        description: "Focused on software engineering and web development"
      }
    ],
    bio: "Full-stack developer with 3+ years of experience building scalable web applications. Passionate about clean code and user experience.",
    projects: [
      {
        title: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB",
        projectLink: "https://github.com/sarah-dev/ecommerce",
        techStack: ["React", "Node.js", "MongoDB", "Express"],
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-06-01")
      }
    ]
  },
  {
    username: "mike_ui",
    name: "Mike Chen",
    email: "mike.chen@demo.com",
    picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    linkedinLink: "https://linkedin.com/in/mike-chen-ui",
    githubLink: "https://github.com/mike-ui",
    portfolioLink: "https://mikechen.design",
    skillsProficientAt: ["UI/UX Design", "Figma", "Adobe Creative Suite", "HTML/CSS", "JavaScript"],
    skillsToLearn: ["React", "Product Management", "User Research"],
    education: [
      {
        institution: "Parsons School of Design",
        degree: "Graphic Design",
        startDate: new Date("2019-09-01"),
        endDate: new Date("2023-05-15"),
        score: 3.8,
        description: "Specialized in digital design and user experience"
      }
    ],
    bio: "UI/UX designer with a passion for creating intuitive and beautiful user interfaces. I love turning complex problems into simple, beautiful designs.",
    projects: [
      {
        title: "Mobile Banking App",
        description: "Designed a complete mobile banking experience with focus on accessibility",
        projectLink: "https://dribbble.com/mike-ui/banking-app",
        techStack: ["Figma", "Adobe XD", "Prototyping"],
        startDate: new Date("2023-03-01"),
        endDate: new Date("2023-08-01")
      }
    ]
  },
  {
    username: "alex_data",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@demo.com",
    picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    linkedinLink: "https://linkedin.com/in/alex-rodriguez-data",
    githubLink: "https://github.com/alex-data",
    portfolioLink: "https://alexrodriguez.tech",
    skillsProficientAt: ["Python", "Machine Learning", "Data Science", "SQL", "TensorFlow"],
    skillsToLearn: ["Deep Learning", "AWS", "Big Data"],
    education: [
      {
        institution: "Stanford University",
        degree: "Data Science",
        startDate: new Date("2017-09-01"),
        endDate: new Date("2021-05-15"),
        score: 3.9,
        description: "Focused on machine learning and statistical analysis"
      }
    ],
    bio: "Data scientist with expertise in machine learning and predictive analytics. I help businesses make data-driven decisions.",
    projects: [
      {
        title: "Customer Churn Prediction",
        description: "Built a machine learning model to predict customer churn with 85% accuracy",
        projectLink: "https://github.com/alex-data/churn-prediction",
        techStack: ["Python", "Scikit-learn", "Pandas", "NumPy"],
        startDate: new Date("2023-02-01"),
        endDate: new Date("2023-07-01")
      }
    ]
  },
  {
    username: "emma_mobile",
    name: "Emma Wilson",
    email: "emma.wilson@demo.com",
    picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    linkedinLink: "https://linkedin.com/in/emma-wilson-mobile",
    githubLink: "https://github.com/emma-mobile",
    portfolioLink: "https://emmawilson.dev",
    skillsProficientAt: ["React Native", "iOS Development", "Android Development", "Swift", "Kotlin"],
    skillsToLearn: ["Flutter", "Backend Development", "DevOps"],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Computer Science",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2022-05-15"),
        score: 3.7,
        description: "Specialized in mobile development and software engineering"
      }
    ],
    bio: "Mobile app developer with experience in both iOS and Android development. I love creating apps that make people's lives easier.",
    projects: [
      {
        title: "Fitness Tracking App",
        description: "Developed a cross-platform fitness tracking app with 50K+ downloads",
        projectLink: "https://github.com/emma-mobile/fitness-app",
        techStack: ["React Native", "Firebase", "Redux"],
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-05-01")
      }
    ]
  },
  {
    username: "david_devops",
    name: "David Kim",
    email: "david.kim@demo.com",
    picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
    linkedinLink: "https://linkedin.com/in/david-kim-devops",
    githubLink: "https://github.com/david-devops",
    portfolioLink: "https://davidkim.tech",
    skillsProficientAt: ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD"],
    skillsToLearn: ["Terraform", "Monitoring", "Security"],
    education: [
      {
        institution: "Georgia Tech",
        degree: "Computer Engineering",
        startDate: new Date("2016-09-01"),
        endDate: new Date("2020-05-15"),
        score: 3.6,
        description: "Focused on systems engineering and infrastructure"
      }
    ],
    bio: "DevOps engineer passionate about automation and infrastructure as code. I help teams deploy faster and more reliably.",
    projects: [
      {
        title: "Microservices Infrastructure",
        description: "Designed and implemented a scalable microservices infrastructure using Docker and Kubernetes",
        projectLink: "https://github.com/david-devops/microservices-infra",
        techStack: ["Docker", "Kubernetes", "AWS", "Terraform"],
        startDate: new Date("2023-04-01"),
        endDate: new Date("2023-09-01")
      }
    ]
  },
  {
    username: "lisa_frontend",
    name: "Lisa Thompson",
    email: "lisa.thompson@demo.com",
    picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    linkedinLink: "https://linkedin.com/in/lisa-thompson-frontend",
    githubLink: "https://github.com/lisa-frontend",
    portfolioLink: "https://lisathompson.dev",
    skillsProficientAt: ["Vue.js", "JavaScript", "CSS3", "HTML5", "Webpack"],
    skillsToLearn: ["React", "TypeScript", "Testing"],
    education: [
      {
        institution: "University of Washington",
        degree: "Web Development",
        startDate: new Date("2019-09-01"),
        endDate: new Date("2023-05-15"),
        score: 3.8,
        description: "Focused on frontend development and user experience"
      }
    ],
    bio: "Frontend developer with a keen eye for design and user experience. I create beautiful, responsive web applications.",
    projects: [
      {
        title: "Real-time Dashboard",
        description: "Built a real-time dashboard for monitoring system metrics with Vue.js",
        projectLink: "https://github.com/lisa-frontend/dashboard",
        techStack: ["Vue.js", "WebSocket", "Chart.js", "Vuex"],
        startDate: new Date("2023-03-01"),
        endDate: new Date("2023-07-01")
      }
    ]
  },
  {
    username: "james_backend",
    name: "James Anderson",
    email: "james.anderson@demo.com",
    picture: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    linkedinLink: "https://linkedin.com/in/james-anderson-backend",
    githubLink: "https://github.com/james-backend",
    portfolioLink: "https://jamesanderson.tech",
    skillsProficientAt: ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "Microservices"],
    skillsToLearn: ["Kotlin", "GraphQL", "Event Sourcing"],
    education: [
      {
        institution: "University of Michigan",
        degree: "Software Engineering",
        startDate: new Date("2017-09-01"),
        endDate: new Date("2021-05-15"),
        score: 3.7,
        description: "Specialized in backend development and system architecture"
      }
    ],
    bio: "Backend developer with expertise in building scalable APIs and microservices. I focus on performance and reliability.",
    projects: [
      {
        title: "Payment Processing API",
        description: "Developed a secure payment processing API handling millions of transactions",
        projectLink: "https://github.com/james-backend/payment-api",
        techStack: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
        startDate: new Date("2023-02-01"),
        endDate: new Date("2023-08-01")
      }
    ]
  },
  {
    username: "anna_qa",
    name: "Anna Martinez",
    email: "anna.martinez@demo.com",
    picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 4.4,
    linkedinLink: "https://linkedin.com/in/anna-martinez-qa",
    githubLink: "https://github.com/anna-qa",
    portfolioLink: "https://annamartinez.tech",
    skillsProficientAt: ["Selenium", "Jest", "Cypress", "Postman", "Test Automation"],
    skillsToLearn: ["Performance Testing", "Security Testing", "API Testing"],
    education: [
      {
        institution: "Arizona State University",
        degree: "Information Technology",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2022-05-15"),
        score: 3.5,
        description: "Focused on software testing and quality assurance"
      }
    ],
    bio: "QA engineer with a passion for ensuring software quality and user satisfaction. I help teams deliver bug-free products.",
    projects: [
      {
        title: "Automated Testing Framework",
        description: "Built a comprehensive automated testing framework for web applications",
        projectLink: "https://github.com/anna-qa/test-framework",
        techStack: ["Selenium", "Jest", "Cypress", "Jenkins"],
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-06-01")
      }
    ]
  },
  {
    username: "tom_fullstack",
    name: "Tom Williams",
    email: "tom.williams@demo.com",
    picture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    linkedinLink: "https://linkedin.com/in/tom-williams-fullstack",
    githubLink: "https://github.com/tom-fullstack",
    portfolioLink: "https://tomwilliams.dev",
    skillsProficientAt: ["MERN Stack", "TypeScript", "GraphQL", "AWS", "Docker"],
    skillsToLearn: ["Rust", "Blockchain", "AI/ML"],
    education: [
      {
        institution: "Carnegie Mellon University",
        degree: "Computer Science",
        startDate: new Date("2016-09-01"),
        endDate: new Date("2020-05-15"),
        score: 3.9,
        description: "Focused on full-stack development and software architecture"
      }
    ],
    bio: "Full-stack developer with experience across the entire tech stack. I love building complete solutions from idea to deployment.",
    projects: [
      {
        title: "Social Media Platform",
        description: "Built a complete social media platform with real-time features",
        projectLink: "https://github.com/tom-fullstack/social-platform",
        techStack: ["React", "Node.js", "MongoDB", "Socket.io", "AWS"],
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-10-01")
      }
    ]
  },
  {
    username: "rachel_product",
    name: "Rachel Green",
    email: "rachel.green@demo.com",
    picture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    rating: 4.3,
    linkedinLink: "https://linkedin.com/in/rachel-green-product",
    githubLink: "https://github.com/rachel-product",
    portfolioLink: "https://rachelgreen.tech",
    skillsProficientAt: ["Product Management", "User Research", "Agile", "Analytics", "Prototyping"],
    skillsToLearn: ["Technical Writing", "Data Analysis", "Leadership"],
    education: [
      {
        institution: "Northwestern University",
        degree: "Business Administration",
        startDate: new Date("2019-09-01"),
        endDate: new Date("2023-05-15"),
        score: 3.6,
        description: "Focused on product management and business strategy"
      }
    ],
    bio: "Product manager with a background in business and technology. I bridge the gap between business needs and technical solutions.",
    projects: [
      {
        title: "E-commerce App Redesign",
        description: "Led the redesign of a major e-commerce app, increasing user engagement by 40%",
        projectLink: "https://rachelgreen.tech/ecommerce-case-study",
        techStack: ["Product Strategy", "User Research", "Prototyping", "Analytics"],
        startDate: new Date("2023-05-01"),
        endDate: new Date("2023-11-01")
      }
    ]
  }
];

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/SkillSwap`
    );
    console.log(
      `\n MongoDB connected: ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

const seedDemoUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing demo users (optional)
    await User.deleteMany({ email: { $regex: /@demo\.com$/ } });
    console.log("Cleared existing demo users");
    
    // Insert demo users
    const result = await User.insertMany(demoUsers);
    console.log(`Successfully added ${result.length} demo users:`);
    
    result.forEach(user => {
      console.log(`- ${user.name} (${user.username}) - ${user.email} - Role: ${user.role}`);
    });
    
    console.log("\nDemo users seeded successfully!");
    console.log("\nAdmin credentials:");
    console.log("Email: admin@skillswap.com");
    console.log("Username: admin_user");
    console.log("Role: admin");
    console.log("\nYou can now login with these credentials to access the admin panel!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding demo users:", error);
    process.exit(1);
  }
};

seedDemoUsers(); 