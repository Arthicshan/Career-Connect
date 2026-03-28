import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const seedData = async () => {
  try {
    // Create Students
    const studentData = [
      {
        name: 'John Doe',
        email: 'john@student.edu',
        password: 'pass123',
        role: 'student',
        education: 'SLIIT',
        skills: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML']
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@student.edu',
        password: 'pass123',
        role: 'student',
        education: 'University of Colombo',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Analysis']
      },
      {
        name: 'Mike Chen',
        email: 'mike@student.edu',
        password: 'pass123',
        role: 'student',
        education: 'UOM',
        skills: ['Java', 'Spring Boot', 'AWS', 'Docker', 'Kubernetes']
      }
    ];

    for (const data of studentData) {
      const existing = await Student.findOne({ email: data.email });
      if (!existing) {
        await Student.create(data);
        console.log(`Student created: ${data.name}`);
      }
    }

    // Create Employees
    const employeeData = [
      {
        name: 'HR Manager',
        email: 'hr@company.com',
        password: 'pass123',
        role: 'employee',
        company: 'Tech Corp'
      },
      {
        name: 'Jane Smith',
        email: 'jane@company.com',
        password: 'pass123',
        role: 'employee',
        company: 'AI Solutions'
      },
      {
        name: 'Tom Brown',
        email: 'tom@startup.com',
        password: 'pass123',
        role: 'employee',
        company: 'Startup Inc'
      }
    ];

    const employees = [];
    for (const data of employeeData) {
      let existing = await Employee.findOne({ email: data.email });
      if (!existing) {
        const emp = await Employee.create(data);
        employees.push(emp);
        console.log(`Employee created: ${data.name}`);
      } else {
        employees.push(existing);
      }
    }

    // Get the first employee for job posting
    const mainEmployee = employees[0];

    // Create Jobs
    const jobData = [
      {
        title: 'Frontend Developer',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Build modern web applications using React and Vue.js. Collaborate with designers and backend developers.',
        skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Vue.js'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 80,000 - 120,000'
      },
      {
        title: 'Backend Developer',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Build scalable APIs and microservices. Work with databases and cloud infrastructure.',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 100,000 - 150,000'
      },
      {
        title: 'ML Engineer',
        company: 'AI Solutions',
        employeeId: employees[1]._id,
        description: 'Develop and deploy machine learning models. Work on NLP and computer vision projects.',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL'],
        location: 'Remote',
        type: 'Full-time',
        salary: 'Rs. 120,000 - 180,000'
      },
      {
        title: 'Full Stack Developer',
        company: 'Startup Inc',
        employeeId: employees[2]._id,
        description: 'Work on end-to-end web development. Handle both frontend and backend tasks.',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 90,000 - 140,000'
      },
      {
        title: 'Data Analyst',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Analyze data and create visualization reports. Support business decisions with insights.',
        skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Power BI'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 70,000 - 100,000'
      },
      {
        title: 'DevOps Engineer',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Manage CI/CD pipelines and cloud infrastructure. Ensure system reliability.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'],
        location: 'Remote',
        type: 'Full-time',
        salary: 'Rs. 110,000 - 160,000'
      },
      {
        title: 'Mobile Developer',
        company: 'AI Solutions',
        employeeId: employees[1]._id,
        description: 'Develop cross-platform mobile applications using React Native or Flutter.',
        skills: ['React Native', 'Flutter', 'JavaScript', 'iOS', 'Android'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 85,000 - 130,000'
      },
      {
        title: 'UI/UX Designer',
        company: 'Startup Inc',
        employeeId: employees[2]._id,
        description: 'Create user-friendly interfaces and experiences. Work closely with product team.',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'CSS', 'Prototyping'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 75,000 - 110,000'
      },
      {
        title: 'Software Engineering Intern',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Learn and assist in software development tasks. Great opportunity for freshers.',
        skills: ['JavaScript', 'Python', 'Java', 'Git'],
        location: 'Colombo',
        type: 'Internship',
        salary: 'Rs. 25,000 - 35,000'
      },
      {
        title: 'Part-time Web Developer',
        company: 'Startup Inc',
        employeeId: employees[2]._id,
        description: 'Flexible part-time web development work. Great for students.',
        skills: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
        location: 'Remote',
        type: 'Part-time',
        salary: 'Rs. 40,000 - 60,000'
      },
      {
        title: 'Cybersecurity Analyst',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Monitor and protect organizational systems. Implement security measures.',
        skills: ['Security', 'Networking', 'Linux', 'Python', 'Firewalls'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 95,000 - 140,000'
      },
      {
        title: 'Product Manager',
        company: 'AI Solutions',
        employeeId: employees[1]._id,
        description: 'Lead product strategy and roadmap development. Work with engineering and design.',
        skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Communication'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 130,000 - 200,000'
      },
      {
        title: 'QA Engineer',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Ensure software quality through testing. Write automated test cases.',
        skills: ['Selenium', 'Jest', 'Testing', 'JavaScript', 'API Testing'],
        location: 'Colombo',
        type: 'Full-time',
        salary: 'Rs. 65,000 - 95,000'
      },
      {
        title: 'Blockchain Developer',
        company: 'Startup Inc',
        employeeId: employees[2]._id,
        description: 'Develop smart contracts and blockchain solutions. Work with Web3 technologies.',
        skills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript', 'Node.js'],
        location: 'Remote',
        type: 'Full-time',
        salary: 'Rs. 140,000 - 200,000'
      },
      {
        title: 'Cloud Architect',
        company: 'Tech Corp',
        employeeId: mainEmployee._id,
        description: 'Design scalable cloud infrastructure. Work with AWS, Azure, and GCP.',
        skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'DevOps'],
        location: 'Remote',
        type: 'Full-time',
        salary: 'Rs. 180,000 - 250,000'
      }
    ];

    const createdJobs = [];
    for (const data of jobData) {
      const existing = await Job.findOne({ title: data.title, employeeId: data.employeeId });
      if (!existing) {
        const job = await Job.create(data);
        createdJobs.push(job);
        console.log(`Job created: ${data.title}`);
      } else {
        createdJobs.push(existing);
      }
    }

    // Create sample applications
    const firstStudent = await Student.findOne({ email: 'john@student.edu' });
    if (firstStudent && createdJobs.length > 0) {
      const applicationData = [
        { jobId: createdJobs[0]._id, studentId: firstStudent._id, status: 'Pending' },
        { jobId: createdJobs[1]._id, studentId: firstStudent._id, status: 'Reviewed' }
      ];

      for (const appData of applicationData) {
        const existing = await Application.findOne({ jobId: appData.jobId, studentId: appData.studentId });
        if (!existing) {
          await Application.create(appData);
          console.log('Application created');
        }
      }
    }

    console.log('Seed data setup complete!');
  } catch (error) {
    console.error('Seed data error:', error);
  }
};
