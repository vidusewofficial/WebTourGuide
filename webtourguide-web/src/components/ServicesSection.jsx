export default function ServicesSection() {
  return (
    <section className="service_section layout_padding" id="services">
      <div className="container">
        <div className="heading_container text-center mb-5">
          <h2>Our Services</h2>
          <p>
            Experience hassle-free travel planning with our premium accommodations, local guide networks, and verified safety.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="box container-bg">
          <div className="detail-box">
            <div className="img-box">
              <img src="/images/s-1.png" alt="Hotels" className="img1" />
              <img src="/images/s-1-blue.png" alt="Hotels" className="img2" />
            </div>
            <div className="text-box">
              <h6>Best Hotels</h6>
              <p>Top-rated stays, luxury resorts, and cozy lodges at the best negotiated prices.</p>
            </div>
          </div>

          <div className="detail-box">
            <div className="img-box">
              <img src="/images/s-2.png" alt="Guides" className="img1" />
              <img src="/images/s-2-blue.png" alt="Guides" className="img2" />
            </div>
            <div className="text-box">
              <h6>Best Trip Guides</h6>
              <p>Experienced local guides who know every hidden gem and cultural treasure.</p>
            </div>
          </div>

          <div className="detail-box">
            <div className="img-box">
              <img src="/images/s-3.png" alt="Safe" className="img1" />
              <img src="/images/s-3-blue.png" alt="Safe" className="img2" />
            </div>
            <div className="text-box">
              <h6>Safe & Secure</h6>
              <p>24/7 travel assistance, verified tours, and fully insured travel journeys.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
