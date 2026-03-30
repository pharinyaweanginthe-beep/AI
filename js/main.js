/* ============================================
   AI Technologies - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // --- Mobile Nav Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Intersection Observer for Animations ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            entry.target.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target + suffix;
          }
        };

        updateCounter();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // --- Smooth scroll for same-page anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Parallax on hero image ---
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      heroImage.style.transform = `translateY(${scroll * 0.08}px)`;
    });
  }

  // --- Typing effect for hero heading (optional) ---
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const text = typingEl.getAttribute('data-text');
    typingEl.textContent = '';
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        typingEl.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
      }
    };
    setTimeout(typeWriter, 500);
  }

  // --- Service Modal Logic ---
  const serviceModal = document.getElementById('serviceModal');
  const modalClose = document.querySelector('.close-modal');
  const serviceLabels = document.querySelectorAll('.service-label');
  
  if (serviceModal && serviceLabels.length > 0) {
    const serviceData = {
      'svc-automation': {
        title: 'AI-Powered Automation',
        img: 'images/robot-arm.png',
        desc: 'ระบบอัตโนมัติอัจฉริยะที่ช่วยลดขั้นตอนการทำงานที่ซ้ำซ้อน เพิ่มประสิทธิภาพและลดต้นทุนการดำเนินงาน โดยระบบสามารถเรียนรู้วิธีการทำงานของคุณและจัดการเอกสาร ข้อมูล หรือสั่งการอุปกรณ์ต่างๆ ได้แบบอัตโนมัติ 24 ชั่วโมง'
      },
      'svc-sales': {
        title: 'Intelligent Sales & Marketing',
        img: 'images/ai-business.png',
        desc: 'เพิ่มยอดขายด้วยระบบการตลาดอัจฉริยะ วิเคราะห์พฤติกรรมกลุ่มเป้าหมายเชิงลึกและส่งข้อเสนอที่ตรงใจลูกค้าแบบ Real-time พร้อมทั้งแนะนำกลยุทธ์การขายที่เหมาะสมที่สุดสำหรับแต่ละสถานการณ์'
      },
      'svc-personalization': {
        title: 'Personalization & Recommendations',
        img: 'images/cute-robots.png',
        desc: 'แนะนำสินค้าและบริการแบบเฉพาะบุคคล (Personalization) ที่เรียนรู้จากรสนิยมและความชอบของลูกค้าแต่ละคน เพื่อเพิ่มประสบการณ์ที่ดี สร้างความประทับใจ และกระตุ้นให้เกิดการซื้อซ้ำได้อย่างมีประสิทธิภาพ'
      },
      'svc-search': {
        title: 'AI-Powered Search & Voice',
        img: 'images/robot-head.png',
        desc: 'ค้นหาอัจฉริยะด้วยเสียงและข้อความ พร้อม Natural Language Processing (NLP) ที่ถูกเทรนให้เข้าใจภาษาไทยได้อย่างลึกซึ้ง สามารถตอบคำถาม ค้นหาข้อมูล หรือสั่งงานด้วยเสียงเสมือนมีมนุษย์คอยช่วยเหลือ'
      },
      'svc-analytics': {
        title: 'Predictive Analytics & Insights',
        img: 'images/robot-warrior.png',
        desc: 'ระบบช่วยวิเคราะห์ข้อมูลล่วงหน้าด้วย AI เพื่อคาดการณ์แนวโน้มตลาด พฤติกรรมลูกค้า และโอกาสทางธุรกิจในอีก 3-6 เดือนข้างหน้า ทำให้คุณสามารถวางแผนกลยุทธ์ได้อย่างแม่นยำและล้ำหน้าคู่แข่งเสมอ'
      },
      'svc-security': {
        title: 'Next-Gen Cybersecurity',
        img: 'images/hero-ai.png',
        desc: 'ปกป้องข้อมูลและระบบโครงสร้างพื้นฐานดิจิทัลของคุณด้วย AI ที่เฝ้าระวัง ค้นหา และตอบสนองต่อภัยคุกคามทางไซเบอร์แบบเรียลไทม์ เรียนรู้รูปแบบการโจมตีใหม่ๆ ด้วยตนเอง เพื่อยกระดับความปลอดภัยให้เหนือกว่าทุกมาตรฐาน'
      },
      'svc-generative': {
        title: 'Generative & Creative AI',
        img: 'images/robot-head.png',
        desc: 'ผสานพลังความคิดสร้างสรรค์ด้วย Generative AI ที่สามารถแต่งเพลง เขียนคอนเทนต์ สร้างงานศิลปะ ออกแบบโมเดล 3 มิติ และเขียนโค้ดได้อย่างฉับไว ช่วยลดขั้นตอนและเพิ่มเวลาให้คุณในการต่อยอดความคิดสร้างสรรค์'
      }
    };

    serviceLabels.forEach(label => {
      label.addEventListener('click', () => {
        const id = label.id;
        const data = serviceData[id];
        if (data) {
          document.getElementById('modalTitle').textContent = data.title;
          document.getElementById('modalImg').src = data.img;
          document.getElementById('modalDesc').textContent = data.desc;
          
          serviceModal.style.display = 'flex';
          setTimeout(() => {
            serviceModal.classList.add('show');
          }, 10);
        }
      });
    });

    const closeMod = () => {
      serviceModal.classList.remove('show');
      setTimeout(() => {
        serviceModal.style.display = 'none';
      }, 300);
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeMod);
    }

    window.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        closeMod();
      }
    });
  }
});
