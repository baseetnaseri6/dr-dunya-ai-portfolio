import profileImage from "../assets/profile.png";

type Props = {
  onClose: () => void;
};

export default function ProfileModal({ onClose }: Props) {
  return (
    <div className="profileOverlay">
      <div className="profileModal">

        <button
          className="closeProfile"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="profileLeft">

          <div className="profileBadge">
            Dr.
          </div>

          <h2>Dr. Dunya Naseri</h2>

          <div className="stars">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="profileRole">
            Medical Doctor
          </p>

          <p className="profileRole">
            Public Health Professional
          </p>

          <p className="profileRole">
            Research Enthusiast
          </p>

          <div className="section">
            <h3>Biography</h3>

            <p>
              Dedicated medical professional with a strong
              passion for clinical excellence, patient care,
              public health and healthcare innovation.
            </p>
          </div>

          <div className="section">
            <h3>Education</h3>

            <ul>
              <li>Doctor of Medicine (MD)</li>
              <li>Clinical Practice</li>
              <li>Public Health Studies</li>
            </ul>
          </div>

          <div className="section">
            <h3>Experience</h3>

            <ul>
              <li>Clinical Care</li>
              <li>Healthcare Projects</li>
              <li>Research Activities</li>
              <li>Patient-Centered Medicine</li>
            </ul>
          </div>

          <div className="profileActions">
            <button>Download CV</button>
            <button>Contact</button>
          </div>

        </div>

        <div className="profileRight">

          <div className="profileCircle"></div>

          <img
            src={profileImage}
            alt="Dr Dunya Naseri"
          />

          <div className="verified">
            ✓ Verified Medical Professional
          </div>

        </div>

      </div>
    </div>
  );
}
