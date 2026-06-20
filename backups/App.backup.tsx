import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUp,
  faBars,
  faBookMedical,
  faBrain,
  faBriefcase,
  faClock,
  faClipboardList,
  faCommentDots,
  faDownload,
  faEnvelope,
  faFileLines,
  faGraduationCap,
  faHeartPulse,
  faHospital,
  faHouse,
  faMicroscope,
  faNotesMedical,
  faPaperPlane,
  faPeopleGroup,
  faPhone,
  faShieldHeart,
  faUser,
  faUserDoctor,
  faImages,
  faUserNurse,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import profileImage from "./assets/profile.png";
import photo1 from "./assets/1.png";
import photo2 from "./assets/2.png";
import photo3 from "./assets/3.png";
import photo4 from "./assets/4.png";
import photo5 from "./assets/5.png";
import photo6 from "./assets/6.png";
import photo7 from "./assets/7.png";
import photo8 from "./assets/8.png";
import photo9 from "./assets/9.png";
import photo10 from "./assets/10.png";
import "./App.css";

type ModalType = "education" | "experience" | "profile" | "skills" | "contact" | null;

type Message = {
  role: "user" | "ai";
  text: string;
  displayText?: string;
  done?: boolean;
  type?: ModalType | "gallery";
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const placeholders = [
    "Ask about Dunya...",
    "Ask about Education...",
    "Ask about Experience...",
    "Ask about Skills...",
    "Ask about Gallery...",
    "Ask about Contact..."
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);






  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, []);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const typeText = (fullText: string, type: ModalType | "gallery") => {
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: fullText,
        displayText: "",
        done: false,
        type,
      },
    ]);

    let i = 0;

    const interval = window.setInterval(() => {
      i++;

      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? {
                ...msg,
                displayText: fullText.slice(0, i),
              }
            : msg
        )
      );

      if (i >= fullText.length) {
        window.clearInterval(interval);

        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? {
                  ...msg,
                  done: true,
                  displayText: fullText,
                }
              : msg
          )
        );
      }
    }, 20);
  };

  const sendMessage = () => {
    const value = input.trim();
    if (!value || typing) return;

    const lower = value.toLowerCase();

    const isEducation =
      lower.includes("education") ||
      lower.includes("educations") ||
      lower.includes("study") ||
      lower.includes("school") ||
      lower.includes("university") ||
      lower.includes("master");

    const isExperience =
      lower.includes("experience") ||
      lower.includes("work") ||
      lower.includes("hospital") ||
      lower.includes("melat") ||
      lower.includes("clinical");

    const isProfile =
      lower.includes("dunya") ||
      lower.includes("profile") ||
      lower.includes("about") ||
      lower.includes("who is");

    const isSkills =
      lower.includes("skill") ||
      lower.includes("strength") ||
      lower.includes("ability");

    const isBlogs =
      lower.includes("blog") ||
      lower.includes("article") ||
      lower.includes("post");

    const isContact =
      lower.includes("contact") ||
      lower.includes("email") ||
      lower.includes("linkedin") ||
      lower.includes("phone");

    const isGallery =
      lower.includes("gallery") ||
      lower.includes("gallary") ||
      lower.includes("image") ||
      lower.includes("images") ||
      lower.includes("photo") ||
      lower.includes("photos");

    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setInput("");
    setTyping(true);

    setTimeout(async () => {
      let replyType: ModalType | "gallery" = null;

      if (isEducation) replyType = "education";
      else if (isExperience) replyType = "experience";
      else if (isGallery) replyType = "gallery";
      else if (isProfile) replyType = "profile";
      else if (isSkills) replyType = "skills";
      else if (isContact) replyType = "contact";

      try {
        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: value }),
        });

        const data = await response.json();

        setTyping(false);
        typeText(
          data.answer || "You can ask about Dunya, Education, Experience, Skills, Gallery, or Contact.",
          replyType
        );
      } catch (error) {
        setTyping(false);

        if (isEducation) {
          typeText("Dr. Dunya Naseri’s education includes school, medical university, clinical courses, and public health preparation.", "education");
        } else if (isExperience) {
          typeText("Dr. Dunya Naseri’s experience includes hospital practice, Melat Hospital, patient care, and clinical development.", "experience");
        } else if (isGallery) {
          typeText("Dr. Dunya’s gallery includes professional medical portfolio photos and selected profile images.", "gallery");
        } else if (isProfile) {
          typeText("Dr. Dunya Naseri is a medical doctor focused on patient-centered care, clinical responsibility, public health, and healthcare improvement.", "profile");
        } else if (isSkills) {
          typeText("Dr. Dunya Naseri’s key skills include patient care, clinical assessment, medical communication, public health awareness, and research mindset.", "skills");
        } else if (isContact) {
          typeText("You can contact Dr. Dunya through email, LinkedIn, or the professional contact form in this portfolio.", "contact");
        } else {
          typeText("AI server is offline. Please start Ollama and the local server.", null);
        }
      }
    }, 650);
  };

  if (loading) {
    return (
      <div className="medicalLoader">
        <div className="loaderGrid"></div>

        <div className="loaderCore">
          <div className="pulseRing ringOne"></div>
          <div className="pulseRing ringTwo"></div>

          <div className="medicalCross">✚</div>

          <div className="heartLine">
            <svg viewBox="0 0 260 80">
              <path d="M5 45 H45 L58 22 L78 62 L98 38 H128 L142 18 L165 65 L185 45 H255" />
            </svg>
          </div>
        </div>

        <div className="loaderText">
          <span>AI Medical Portfolio</span>
          <h1>Dr. Dunya Naseri</h1>
          <p>Initializing clinical profile environment...</p>
        </div>

        <div className="loaderDots">
          <i></i><i></i><i></i>
        </div>
      </div>
    );
  }

  return (
    <main className={`page ${sideOpen ? "sideOpen" : "sideClosed"}`}>
      <aside className="sidebar">
        <button className="menuBtn" onClick={() => setSideOpen(!sideOpen)}>
          <FontAwesomeIcon icon={sideOpen ? faXmark : faBars} />
        </button>

        <div className="logo">DN</div>

        {sideOpen && (
          <>
            <nav className="navIcons">
              <button className="active sideTip" data-tip="Home" data-tip="Home"><FontAwesomeIcon icon={faHouse} /></button>
              <button className="sideTip" data-tip="Gallery" onClick={() => setGalleryOpen(true)}><FontAwesomeIcon icon={faImages} /></button>
              <button className="sideTip" data-tip="Profile" onClick={() => setModalType("profile")}><FontAwesomeIcon icon={faUserDoctor} /></button>
              <button className="sideTip" data-tip="Contact" onClick={() => setContactOpen(true)}><FontAwesomeIcon icon={faEnvelope} /></button>
            </nav>

            <div className="sideSocial">
              <span />
              <FontAwesomeIcon icon={faLinkedinIn} />
              <FontAwesomeIcon icon={faGithub} />
              <button className="sideIconButton" onClick={() => setContactOpen(true)}>
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>
          </>
        )}
      </aside>

      <section className="leftPanel">
        {!chatOpen ? (
          <div className="intro animateIn">
            <div className="heroNameBlock">
              <div className="doctorSignature">
                <span>Dr.</span>
              </div>

              <div>
                <p className="eyebrow">Medical Doctor</p>
                <h1>Dunya Naseri</h1>
              </div>
            </div>

            <p className="role">
              CLINICAL CARE • PUBLIC HEALTH • RESEARCH • PATIENT-CENTERED MEDICINE
            </p>

            <p className="desc">
              A dedicated medical professional focused on compassionate care,
              public health impact, clinical excellence and meaningful patient outcomes.
            </p>

            <div className="links">
              <span><FontAwesomeIcon icon={faLinkedinIn} /> LinkedIn</span>
              <span><FontAwesomeIcon icon={faGithub} /> GitHub</span>
              <span><FontAwesomeIcon icon={faEnvelope} /> Email</span>
              <span><FontAwesomeIcon icon={faDownload} /> Download CV</span>
            </div>

            <button className="chatDock" onClick={() => setChatOpen(true)}>
              <FontAwesomeIcon icon={faCommentDots} />
              <span>{placeholders[placeholderIndex]}</span>
              <b><FontAwesomeIcon icon={faArrowUp} /></b>
            </button>
          </div>
        ) : (
          <div className="chatPanel animateIn">
            <div className="chatHeader">
              <div>
                <strong><FontAwesomeIcon icon={faCommentDots} /> Dunya AI Assistant</strong>
                <small>● Online</small>
              </div>
              <button onClick={() => setChatOpen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="chatBody">
              {messages.length === 0 && (
                <div className="emptyChat">
                  <div className="emptyChatIcon">DN</div>
                  <h3>Dunya AI Assistant</h3>
                  <p>Ask about Dunya, Education, Experience, Skills, Gallery, or Contact.</p>
                  <span>Try: “Tell me about Education”</span>
                </div>
              )}

              {messages.map((msg, index) =>
                msg.role === "user" ? (
                  <div className="userMsg" key={index}>{msg.text}</div>
                ) : (
                  <div className="aiRow" key={index}>
                    <div className="avatar">DN</div>
                    <div className={`aiMsg ${msg.displayText !== undefined && !msg.done ? "isTyping" : ""}`}>
                      {msg.displayText ?? msg.text}

                      {msg.type && msg.done && (
                        <button
                          className="readMoreBtn"
                          onClick={() => {
                            if (msg.type === "gallery") {
                              setGalleryOpen(true);
                            } else if (msg.type === "contact") {
                              setContactOpen(true);
                            } else {
                              setModalType(msg.type ?? null);
                            }
                          }}
                        >
                          Read More →
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {typing && (
                <div className="aiRow">
                  <div className="avatar">DN</div>
                  <div className="typingBubble">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>

            <div className="chatInput">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={placeholders[placeholderIndex]}
              />
              <button onClick={sendMessage}>
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rightPanel">
        <div className="dots" />
        <div className="circle" />

        <div className="photoArea">
          <img src={profileImage} alt="Dr. Dunya Naseri" />
        </div>

        <div className="nameArea">
          <div className="drTag">Dr.</div>
          <h2>DUNYA<br /><span>NASERI</span></h2>
          <div className="goldLine" />
          <p>Medical Doctor</p>
        </div>
      </section>

      {galleryOpen && (
        <div className="profileOverlay">
          <div className="galleryModal">
            <button className="closeProfile" onClick={() => setGalleryOpen(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="galleryHeader">
              <span>Doctor Gallery</span>
              <h2>Dr. Dunya Naseri</h2>
              <p>Professional medical portfolio photo gallery.</p>
            </div>

            <div className="galleryGrid">
              {[
                  photo1,
                  photo2,
                  photo3,
                  photo4,
                  photo5,
                  photo6,
                  photo7,
                  photo8,
                  photo9,
                  photo10
                ].map((img, i) => (
                <button className="galleryCard" key={i} onClick={() => setSelectedPhoto(img)}>
                  <img src={img} alt={`Gallery ${i + 1}`} />
                  <div>
                    <b>Medical Portrait {i + 1}</b>
                    <span>Click to preview</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPhoto && (
            <div className="photoPreview" onClick={() => setSelectedPhoto(null)}>
              <button className="previewClose" onClick={() => setSelectedPhoto(null)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <img src={selectedPhoto} alt="Large preview" />
            </div>
          )}
        </div>
      )}

      {contactOpen && (
        <div className="profileOverlay">
          <div className="simpleContact">
            <button className="closeProfile" onClick={() => setContactOpen(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="simpleContactInfo">
              <span>Contact</span>
              <h2>Let’s Talk</h2>
              <p>
                Send a professional message for collaboration, medical portfolio
                inquiries, public health topics, or general contact.
              </p>

              <div className="simpleInfoList">
                <div>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <div>
                    <b>Email</b>
                    <small>dunyanaseri@gmail.com</small>
                  </div>
                </div>

                <div>
                  <FontAwesomeIcon icon={faLinkedinIn} />
                  <div>
                    <b>LinkedIn</b>
                    <small>Dr. Dunya Naseri</small>
                  </div>
                </div>

                <div>
                  <FontAwesomeIcon icon={faPhone} />
                  <div>
                    <b>Availability</b>
                    <small>Professional inquiries</small>
                  </div>
                </div>
              </div>
            </div>

            <form className="simpleContactForm" onSubmit={(e) => e.preventDefault()}>
              <div className="simpleFormHeader">
                <FontAwesomeIcon icon={faHeartPulse} />
                <div>
                  <h3>Medical Contact Form</h3>
                  <p>AI medical portfolio communication</p>
                </div>
              </div>

              <div className="simpleFormGrid">
                <div className="simpleField">
                  <FontAwesomeIcon icon={faUser} />
                  <input placeholder="Full name" />
                </div>

                <div className="simpleField">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input placeholder="Email address" />
                </div>
              </div>

              <div className="simpleField">
                <FontAwesomeIcon icon={faCommentDots} />
                <input placeholder="Subject" />
              </div>

              <div className="simpleField simpleTextarea">
                <FontAwesomeIcon icon={faClipboardList} />
                <textarea placeholder="Write your message..." />
              </div>

              <button className="simpleSend" type="submit">
                <FontAwesomeIcon icon={faPaperPlane} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {modalType === "profile" && (
        <div className="profileOverlay">
          <div className="aboutModal">
            <button className="closeProfile" onClick={() => setModalType(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="aboutModalLeft">
              <div className="aboutPill">
                <FontAwesomeIcon icon={faUserDoctor} />
                <span>About Doctor</span>
              </div>

              <h2>Dr. Dunya Naseri</h2>

              <p>
                Dr. Dunya Naseri is a medical doctor focused on patient-centered
                care, clinical responsibility, public health, and healthcare improvement.
              </p>

              <p>
                Her professional profile is built around empathy, clinical learning,
                responsible communication, and a strong interest in improving patient outcomes.
              </p>

              <div className="aboutDoctorGrid">
                <div>
                  <span>Role</span>
                  <b>Medical Doctor</b>
                </div>
                <div>
                  <span>Focus</span>
                  <b>Patient Care</b>
                </div>
                <div>
                  <span>Interest</span>
                  <b>Public Health</b>
                </div>
                <div>
                  <span>Strength</span>
                  <b>Clinical Responsibility</b>
                </div>
              </div>
            </div>

            <div className="aboutModalRight">
              <div className="aboutCircle"></div>
              <img src={profileImage} alt="Dr. Dunya Naseri" />
              <div className="verified">✓ Medical Professional</div>
            </div>
          </div>
        </div>
      )}

      {modalType === "skills" && (
        <div className="profileOverlay">
          <div className="skillsModal">
            <button className="closeProfile" onClick={() => setModalType(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="skillsHeader">
              <span>Professional Medical Skills</span>
              <h2>Core Skills</h2>
              <p>
                A clean overview of Dr. Dunya Naseri’s medical, communication,
                public health and patient-care strengths.
              </p>
            </div>

            <div className="skillsGrid">
              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faHeartPulse} /></div><h3>Patient Care</h3>
                <p>Compassionate care focused on patient comfort, trust and wellbeing.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faNotesMedical} /></div><h3>Clinical Assessment</h3>
                <p>Understanding symptoms, patient history and clinical observations.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faUserNurse} /></div><h3>Medical Communication</h3>
                <p>Clear communication with patients, families and healthcare teams.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faHospital} /></div><h3>Public Health</h3>
                <p>Interest in prevention, awareness and community health improvement.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faMicroscope} /></div><h3>Research Mindset</h3>
                <p>Evidence-based thinking and continuous medical learning.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faPeopleGroup} /></div><h3>Team Collaboration</h3>
                <p>Working professionally with multidisciplinary healthcare teams.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faBookMedical} /></div><h3>Patient Education</h3>
                <p>Helping patients understand care plans and healthy choices.</p>
              </div>

              <div className="skillCard">
                <div className="skillIcon"><FontAwesomeIcon icon={faShieldHeart} /></div><h3>Medical Ethics</h3>
                <p>Confidentiality, responsibility, professionalism and integrity.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {(modalType === "education" || modalType === "experience") && (
        <div className="profileOverlay">
          <div className="eduExpModal">
            <button className="closeProfile" onClick={() => setModalType(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="eduExpHeader">
              <span>Professional Medical Journey</span>
              <h2>Education & Experience</h2>
              <p>Structured profile of Dr. Dunya Naseri’s academic path and clinical background.</p>
            </div>

            <div className="eduExpBody">
              <section className="journeyColumn educationSide">
                <div className="columnTitle">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <div>
                    <span>Academic Path</span>
                    <h3>Education</h3>
                  </div>
                </div>

                <div className="journeyList">
                  <div className="journeyItem">
                    <em>2011 - 2014</em>
                    <h4>High School Diploma</h4>
                    <p>Strong academic foundation with focus on science, biology and preparation for medical studies.</p>
                    <b>School Education</b>
                  </div>

                  <div className="journeyItem">
                    <em>2014 - 2021</em>
                    <h4>Doctor of Medicine</h4>
                    <p>Medical university education focused on anatomy, physiology, pathology, diagnosis, treatment and patient care.</p>
                    <b>Medical University</b>
                  </div>

                  <div className="journeyItem">
                    <em>2022</em>
                    <h4>Clinical Training Courses</h4>
                    <p>Professional courses related to clinical practice, patient communication and healthcare responsibility.</p>
                    <b>Medical Courses</b>
                  </div>

                  <div className="journeyItem">
                    <em>2024 - 2025</em>
                    <h4>Public Health Preparation</h4>
                    <p>Interest in public health, prevention, healthcare systems and community-based medical improvement.</p>
                    <b>Public Health</b>
                  </div>

                  <div className="journeyItem">
                    <em>Future Goal</em>
                    <h4>Master Degree</h4>
                    <p>Goal to continue postgraduate study in public health or healthcare management to create wider impact.</p>
                    <b>Master Path</b>
                  </div>
                </div>
              </section>

              <section className="journeyColumn experienceSide">
                <div className="columnTitle">
                  <FontAwesomeIcon icon={faBriefcase} />
                  <div>
                    <span>Clinical Background</span>
                    <h3>Experience</h3>
                  </div>
                </div>

                <div className="journeyList">
                  <div className="journeyItem">
                    <em>2020 - 2021</em>
                    <h4>Hospital Clinical Rotation</h4>
                    <p>Practical exposure to patient care, observation, doctor-patient communication and hospital workflow.</p>
                    <b>Hospital Practice</b>
                  </div>

                  <div className="journeyItem">
                    <em>2021 - 2022</em>
                    <h4>Melat Hospital</h4>
                    <p>Clinical environment experience with focus on patient support, medical responsibility and teamwork.</p>
                    <b>Melat Hospital</b>
                  </div>

                  <div className="journeyItem">
                    <em>2022 - 2023</em>
                    <h4>Patient Care & Consultation</h4>
                    <p>Experience supporting patients with empathy, clear communication and responsible healthcare guidance.</p>
                    <b>Clinical Care</b>
                  </div>

                  <div className="journeyItem">
                    <em>2023 - 2024</em>
                    <h4>Healthcare Awareness</h4>
                    <p>Interest in prevention, public health education and improving health awareness in communities.</p>
                    <b>Public Health</b>
                  </div>

                  <div className="journeyItem">
                    <em>Present</em>
                    <h4>Professional Development</h4>
                    <p>Continuing to build medical knowledge, research mindset and patient-centered healthcare practice.</p>
                    <b>Growth</b>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
