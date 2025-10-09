export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileNode>;
  executable?: boolean;
}

export const fileSystem: Record<string, FileNode> = {
  home: {
    name: 'home',
    type: 'directory',
    children: {
      jack: {
        name: 'jack',
        type: 'directory',
        children: {
          about: {
            name: 'about',
            type: 'directory',
            children: {
              'bio.txt': {
                name: 'bio.txt',
                type: 'file',
                content: `Full-stack developer specializing in React, TypeScript, and Python.

I build scalable web applications, data pipelines, and automation solutions.
Currently pursuing B.S. in Computer Science at UT Dallas.

Passionate about creating efficient, elegant code and solving complex problems.
Always learning new technologies and staying current with industry trends.

"In a world of 1s and 0s, I strive to be a 2."`
              },
              'education.json': {
                name: 'education.json',
                type: 'file',
                content: JSON.stringify({
                  university: 'University of Texas at Dallas',
                  degree: 'B.S. Computer Science',
                  graduationYear: 2025,
                  gpa: 3.8,
                  relevantCourses: [
                    'Data Structures & Algorithms',
                    'Software Engineering',
                    'Database Systems',
                    'Web Development',
                    'Computer Networks'
                  ]
                }, null, 2)
              },
              'interests.md': {
                name: 'interests.md',
                type: 'file',
                content: `# Interests

## Technical
- Full-stack web development
- Cloud architecture (AWS, Azure)
- DevOps & CI/CD pipelines
- Machine Learning & AI
- Open source contribution

## Personal
- Cybersecurity & ethical hacking
- Sci-fi novels & cyberpunk aesthetics
- Building mechanical keyboards
- Photography & video editing
- Coffee brewing techniques`
              }
            }
          },
          projects: {
            name: 'projects',
            type: 'directory',
            children: {
              'portfolio-site.md': {
                name: 'portfolio-site.md',
                type: 'file',
                content: `# Interactive Portfolio Site

**Tech Stack:** React, TypeScript, Three.js, Framer Motion

A cyberpunk-themed portfolio with terminal interface and interactive 3D visualizations.

## Features
- Full terminal OS experience
- Neural network navigation map
- AR scanning system
- Breach protocol challenges
- Dual input (CLI + GUI)

## Highlights
- Custom command parser with autocomplete
- Virtual file system implementation
- Real-time 3D graphics with Three.js
- Smooth state synchronization
- Mobile-responsive design

**Status:** Active Development
**Repository:** github.com/jackcao/portfolio`
              },
              'data-pipeline.md': {
                name: 'data-pipeline.md',
                type: 'file',
                content: `# Automated Data Pipeline

**Tech Stack:** Python, Apache Airflow, PostgreSQL, AWS S3

Built scalable ETL pipeline processing 1M+ records daily.

## Key Achievements
- Reduced processing time by 73%
- Automated data validation & cleaning
- Real-time error monitoring & alerts
- Cost optimization saving $2k/month

## Technical Details
- Airflow DAGs for orchestration
- Pandas for data transformation
- SQLAlchemy for database operations
- AWS Lambda for serverless functions

**Status:** Production
**Impact:** 1M+ records/day processed`
              },
              'automation-tool.md': {
                name: 'automation-tool.md',
                type: 'file',
                content: `# Workflow Automation Tool

**Tech Stack:** Python, Selenium, FastAPI, React

Chrome extension + web app for automating repetitive tasks.

## Features
- Visual workflow builder (drag & drop)
- 50+ pre-built actions
- Schedule & trigger system
- Cloud sync & sharing

## Stats
- 500+ active users
- 10,000+ workflows created
- Average 5 hours saved per user/week

**Status:** Active
**Users:** 500+ organizations`
              }
            }
          },
          skills: {
            name: 'skills',
            type: 'directory',
            children: {
              'languages.json': {
                name: 'languages.json',
                type: 'file',
                content: JSON.stringify({
                  expert: ['JavaScript', 'TypeScript', 'Python'],
                  proficient: ['Java', 'C++', 'SQL', 'HTML/CSS'],
                  familiar: ['Go', 'Rust', 'PHP', 'Bash']
                }, null, 2)
              },
              'frameworks.json': {
                name: 'frameworks.json',
                type: 'file',
                content: JSON.stringify({
                  frontend: ['React', 'Next.js', 'Vue.js', 'Svelte'],
                  backend: ['Node.js', 'Express', 'FastAPI', 'Django'],
                  mobile: ['React Native', 'Flutter'],
                  testing: ['Jest', 'Cypress', 'Pytest']
                }, null, 2)
              },
              'tools.json': {
                name: 'tools.json',
                type: 'file',
                content: JSON.stringify({
                  devops: ['Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins'],
                  cloud: ['AWS (EC2, S3, Lambda)', 'Google Cloud', 'Azure'],
                  databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
                  other: ['Git', 'Linux', 'Nginx', 'GraphQL']
                }, null, 2)
              }
            }
          },
          experience: {
            name: 'experience',
            type: 'directory',
            children: {
              internships: {
                name: 'internships',
                type: 'directory',
                children: {
                  'tech-company-2024.txt': {
                    name: 'tech-company-2024.txt',
                    type: 'file',
                    content: `Software Engineering Intern
Tech Company Inc. | Summer 2024

- Developed microservices handling 100k+ requests/day
- Optimized database queries, reducing latency by 45%
- Implemented CI/CD pipeline with automated testing
- Collaborated with team of 8 engineers using Agile

Tech: React, Node.js, PostgreSQL, Docker, AWS`
                  },
                  'startup-2023.txt': {
                    name: 'startup-2023.txt',
                    type: 'file',
                    content: `Full-Stack Developer Intern
Startup XYZ | Summer 2023

- Built customer dashboard from scratch (10k+ users)
- Integrated third-party APIs (Stripe, SendGrid)
- Reduced load time by 60% through optimization
- Led feature development end-to-end

Tech: Next.js, TypeScript, MongoDB, Vercel`
                  }
                }
              }
            }
          },
          contact: {
            name: 'contact',
            type: 'directory',
            children: {
              'email.txt': {
                name: 'email.txt',
                type: 'file',
                content: 'jack.cao@utdallas.edu'
              },
              'phone.txt': {
                name: 'phone.txt',
                type: 'file',
                content: '737-895-5742'
              },
              'social.json': {
                name: 'social.json',
                type: 'file',
                content: JSON.stringify({
                  github: 'github.com/jackcao',
                  linkedin: 'linkedin.com/in/jackcao',
                  twitter: '@jackcao_dev',
                  portfolio: 'jackcao.dev'
                }, null, 2)
              },
              'resume.pdf': {
                name: 'resume.pdf',
                type: 'file',
                content: '[BINARY FILE - Use "download resume.pdf" to view]'
              }
            }
          },
          bin: {
            name: 'bin',
            type: 'directory',
            children: {
              network: {
                name: 'network',
                type: 'file',
                executable: true,
                content: '[EXECUTABLE] Neural Network Map Visualizer v1.0'
              },
              scanner: {
                name: 'scanner',
                type: 'file',
                executable: true,
                content: '[EXECUTABLE] AR Scanner System v1.0'
              },
              breach: {
                name: 'breach',
                type: 'file',
                executable: true,
                content: '[EXECUTABLE] Breach Protocol Challenge v1.0'
              },
              theme: {
                name: 'theme',
                type: 'file',
                executable: true,
                content: '[EXECUTABLE] Theme Manager v1.0'
              }
            }
          }
        }
      }
    }
  }
};

export const startingDirectory = '/home/jack';
