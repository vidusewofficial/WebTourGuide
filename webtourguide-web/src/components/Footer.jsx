import { Link } from "react-router-dom";

export default function Footer() {
  function handleSubscribe(e) {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  }

  return (
    <section className="info_section mt-auto">
      <div className="container pt-5 pb-3">
        <div className="heading_container text-center">
          <h2 style={{ color: "#ffffff", fontWeight: "700", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Contact Us</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            Have questions about planning your next dream tour? Get in touch with our team today.
          </p>
        </div>
      </div>

      <div className="info_container" style={{ marginTop: "30px", paddingTop: "50px" }}>

        <div className="container">
          <div className="social_container">
            <div className="info_social">
              <div>
                <a href="#facebook" onClick={(e) => e.preventDefault()}>
                  <img src="/images/facebook-logo-button.png" alt="Facebook" />
                </a>
              </div>
              <div>
                <a href="#twitter" onClick={(e) => e.preventDefault()}>
                  <img src="/images/twitter-logo-button.png" alt="Twitter" />
                </a>
              </div>
              <div>
                <a href="#linkedin" onClick={(e) => e.preventDefault()}>
                  <img src="/images/linkedin.png" alt="LinkedIn" />
                </a>
              </div>
              <div>
                <a href="#instagram" onClick={(e) => e.preventDefault()}>
                  <img src="/images/instagram.png" alt="Instagram" />
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h5>Subscribe Newsletter</h5>
              <p>
                Stay updated with the latest travel destinations, tips, and exclusive packages.
              </p>
              <form onSubmit={handleSubscribe}>
                <input type="email" placeholder="Enter your email" required />
                <div>
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </div>

            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="info_nav_link">
                <h5>Useful Links</h5>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/destinations">Destinations</Link>
                  </li>
                  <li>
                    <Link to="/services">Services</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4">
              <h5>Address & Contact</h5>
              <div className="info_link-box">
                <a href="#location" onClick={(e) => e.preventDefault()}>
                  <img src="/images/location2.png" alt="Location" />
                  <span>Main Travel Plaza, Colombo & Global</span>
                </a>
                <a href="tel:+01234567890">
                  <img src="/images/call.png" alt="Call" />
                  <span>Call : +01 234 567 890</span>
                </a>
                <a href="mailto:info@webtourguide.com">
                  <img src="/images/mail.png" alt="Mail" />
                  <span> info@webtourguide.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* footer section */}
          <section className="footer_section">
            <p>
              Copyright &copy; {new Date().getFullYear()} All Rights Reserved By{" "}
              <strong>Web Based Tourguide Sri Lanka</strong>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
