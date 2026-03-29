// function showSection(id) {
//   document.querySelectorAll('.section').forEach(sec =>
//     sec.classList.remove('active')
//   );

//   document.getElementById(id).classList.add('active');

//   document.querySelectorAll('.nav-btn').forEach(btn =>
//     btn.classList.remove('active')
//   );

//   event.target.classList.add('active');
// }

function showSection(sectionId, btn) {
  // إخفاء كل الأقسام
  document.querySelectorAll('.section').forEach(sec => {
    sec.style.display = 'none';
  });

  // إظهار القسم المطلوب
  const section = document.getElementById(sectionId);
  section.style.display = 'block';

  // تفعيل زر النافبار
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // عمل scroll بسلاسة
  section.scrollIntoView({
    behavior: 'smooth'
  });
}

// profile ========================================
const toggleProfileBtn = document.getElementById("toggleProfileBtn");
const profile = document.querySelector(".profile");

toggleProfileBtn.addEventListener("click", () => {
  profile.classList.toggle("active");
});


// resume =========================

    const resumeData = {
      education: [
        {
          title: 'Atlas High School, Mediouna',
          date: '2021 - 2022',
          description: 'Baccalaureate in Life and Earth Sciences.'
        },
        {
          title: 'OFPPT CFPMS Tit Mellil',
          date: '2022 - 2024',
          description: 'Full Stack Developer Certificate covering front-end and back-end development skills, building complete web applications using the latest technologies.'
        }
      ],
      experience: [
        {
          title: 'Assistant',
          date: '07 - 2021',
          points: [
            'Assisting in arranging goods and putting them in place.',
            'Preparing orders and loading them into the delivery truck.',
            'Check the number of the commodity and verify it according to its regulation.'
          ]
        },
        {
          title: 'Trainee',
          date: '06 - 2024',
          points: [
            'Assisting in arranging goods and putting them in place.',
            'Preparing orders and loading them into the delivery truck.',
            'Check the number of the commodity and verify it according to its regulation.'
          ]
        }
      ],
      skills: [
        { name: 'Web Design', percent: 80 },
        { name: 'Graphic Design', percent: 70 },
        { name: 'Branding', percent: 90 },
        { name: 'Word - Excel', percent: 80 }
      ]
    };

    function renderTimelineSection(targetId, icon, title, items, type = 'description') {
      const container = document.getElementById(targetId);
      container.innerHTML = `
        <div class="block-header">
          <div class="block-icon">
            <img src="${icon}" alt="${title} icon" class="section-icon-img">
          </div>
          <h2>${title}</h2>
        </div>
        <div class="timeline">
          ${items.map(item => `
            <div class="timeline-item">
              <h3>${item.title}</h3>
              <div class="date">${item.date}</div>
              <div class="desc">
                ${type === 'description'
                  ? item.description
                  : `<ul>${item.points.map(point => `<li>${point}</li>`).join('')}</ul>`}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function renderSkills(targetId, skills) {
      const container = document.getElementById(targetId);
      container.innerHTML = `
        <h2 class="skills-title">My Skills</h2>
        <div class="skills-box">
          ${skills.map(skill => `
            <div class="skill-item">
              <div class="skill-top">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percent">${skill.percent}%</span>
              </div>
              <div class="progress">
                <div class="progress-bar" style="width: ${skill.percent}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    renderTimelineSection(
  'education-section',
  'https://res.cloudinary.com/dhoigmq1n/image/upload/v1774626695/EDU_ptjrob.png',
  'Education',
  resumeData.education,
  'description'
);

renderTimelineSection(
  'experience-section',
  'https://res.cloudinary.com/dhoigmq1n/image/upload/v1774626695/EXP_dcv9dz.png',
  'Experience',
  resumeData.experience,
  'points'
);

    renderSkills('skills-section', resumeData.skills);


    // ==============================  EmailJS in contact
(function () {
  emailjs.init({
    publicKey: "Jkqbyhs5S9XWvU0kG"
  });
})();

const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  sendBtn.disabled = true;
  sendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Sending...</span>`;
  statusMessage.textContent = "";

  emailjs.sendForm(
    "service_bp4y76c" ,
    "template_7hyk918" ,
    form
  )
  .then(() => {
    statusMessage.textContent = "Message sent successfully!";
    form.reset();

    sendBtn.disabled = false;
    sendBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i><span>Send Message</span>`;
  })
  .catch((error) => {
    console.error("EmailJS Error:", error);
    statusMessage.textContent = "Failed to send message. Please try again.";

    sendBtn.disabled = false;
    sendBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i><span>Send Message</span>`;
  });
});

// portfolio ==========================================================================================================================


import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const portfolioGrid = document.getElementById("portfolioGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectModal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let allProjects = [];
let currentCategory = "all";

// full img=========

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("modal-gallery-image")) {
    // عرض الصورة في الـ lightbox
    lightboxImg.src = e.target.src;
    lightbox.style.display = "flex";
  }
});

// إغلاق الـ lightbox عند الضغط في أي مكان
lightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});

// =================


function formatCategory(category) {
  const map = {
    "web-design": "Web Design",
    "front-end": "Front End",
    "graphic-design": "Graphic Design",
    "branding": "Branding"
  };

  return map[category] || category;
}

function renderProjects(projects) {
  portfolioGrid.innerHTML = "";

  if (!projects.length) {
    portfolioGrid.innerHTML = `<p class="empty-message">No projects found.</p>`;
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <img src="${project.coverImage}" alt="${project.title}" class="project-image">
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <button class="more-btn" data-id="${project.id}">View More</button>
      </div>
    `;

    portfolioGrid.appendChild(card);
  });

  const moreButtons = document.querySelectorAll(".more-btn");

  moreButtons.forEach(button => {
    button.addEventListener("click", () => {
      const projectId = button.dataset.id;
      const project = allProjects.find(item => item.id === projectId);

      if (project) {
        openProjectModal(project);
      }
    });
  });
}

function applyFilter(category) {
  currentCategory = category;

  if (category === "all") {
    renderProjects(allProjects);
    return;
  }

  const filteredProjects = allProjects.filter(project => project.category === category);
  renderProjects(filteredProjects);
}

function openProjectModal(project) {
  const imagesHTML = project.images.map(imageUrl => {
    return `<img src="${imageUrl}" alt="${project.title}" class="modal-gallery-image">`;
  }).join("");

  modalBody.innerHTML = `
    <h2 class="modal-title">${project.title}</h2>
    <p class="modal-category">${formatCategory(project.category)}</p>
    <p class="modal-description">${project.description}</p>
    <div class="modal-gallery">
      ${imagesHTML}
    </div>
  `;

  projectModal.classList.add("show");
}

function closeProjectModal() {
  projectModal.classList.remove("show");
}

async function loadProjects() {
  portfolioGrid.innerHTML = `<p class="loading-text">Loading projects...</p>`;

  try {
    const snapshot = await get(ref(db, "projects"));

    if (snapshot.exists()) {
      const data = snapshot.val();

      allProjects = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));

      // ترتيب الأحدث أولًا
      allProjects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      applyFilter(currentCategory);
    } else {
      allProjects = [];
      renderProjects([]);
    }
  } catch (error) {
    console.error("Error loading projects:", error);
    portfolioGrid.innerHTML = `<p class="empty-message">Failed to load projects.</p>`;
  }
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;
    applyFilter(category);
  });
});

closeModal.addEventListener("click", closeProjectModal);

projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) {
    closeProjectModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProjectModal();
  }
});

loadProjects();


// =========================================================================================
window.showSection = showSection;