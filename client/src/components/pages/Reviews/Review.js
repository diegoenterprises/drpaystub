import React, { useEffect, useState } from "react";
import { axios } from "../../../HelperFunctions/axios";
import SEO from "../../SEO";

const StarIcon = ({ filled, half, onClick, onMouseEnter, onMouseLeave, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ cursor: onClick ? "pointer" : "default", transition: "transform 0.15s ease" }}
  >
    <defs>
      <linearGradient id="starGrad">
        <stop offset="0%" stopColor="#5b9dff" />
        <stop offset="100%" stopColor="#d46dff" />
      </linearGradient>
    </defs>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? "url(#starGrad)" : half ? "url(#starGrad)" : "none"}
      stroke={filled || half ? "none" : "var(--color-text-tertiary)"}
      strokeWidth={filled || half ? 0 : 1.5}
      opacity={filled ? 1 : half ? 0.5 : 0.3}
    />
  </svg>
);

const StarRating = ({ value, onChange, size = 32, interactive = true }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={size}
          filled={(hover || value) >= star}
          onClick={interactive ? () => onChange(star) : undefined}
          onMouseEnter={interactive ? () => setHover(star) : undefined}
          onMouseLeave={interactive ? () => setHover(0) : undefined}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const initials = (review.customer_name || "A")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className="dash-section-card" style={{ padding: "28px 24px", height: "100%" }}>
      <div style={{ marginBottom: 16 }}>
        <StarRating value={review.rating} onChange={() => {}} interactive={false} size={18} />
      </div>
      <p style={{ color: "var(--color-text-primary)", fontSize: 15, lineHeight: 1.7, flex: 1, margin: "0 0 20px" }}>
        "{review.description}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid var(--color-border)", paddingTop: 16 }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "var(--gradient-brand)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
            {review.customer_name || "Anonymous"}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/reviews");
      setReviews(response.data.reviews || []);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (rating === 0) { setError("Please select a star rating"); return; }
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!description.trim()) { setError("Please write your review"); return; }

    setSubmitting(true);
    try {
      await axios.post("/api/reviews", {
        product: "Paystub",
        customer_name: name.trim(),
        customer_email: email.trim(),
        description: description.trim(),
        rating,
      });
      setSubmitted(true);
      setRating(0); setName(""); setEmail(""); setDescription("");
      fetchReviews();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div style={{ minHeight: "80vh", padding: "100px 0 60px" }}>
      <SEO
        title="Reviews & Testimonials"
        description="See what thousands of satisfied customers say about Saurellius. Real reviews from business owners, contractors, and freelancers who trust our paystub generator."
        path="/reviews"
        keywords="saurellius reviews, paystub generator reviews, dr paystub testimonials, pay stub maker ratings"
      />
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48, padding: "0 20px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>
          TESTIMONIALS
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
          What our customers say.
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto" }}>
          Real reviews from real people who trust Saurellius for their payroll needs.
        </p>
      </div>

      <div className="container">
        {/* Stats + Form Row */}
        <div className="row" style={{ marginBottom: 48, gap: "24px 0" }}>
          {/* Rating Summary */}
          <div className="col-lg-5">
            <div className="dash-section-card" style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{avg}</span>
                <span style={{ fontSize: 16, color: "var(--color-text-tertiary)" }}>/ 5</span>
              </div>
              <StarRating value={Math.round(parseFloat(avg))} onChange={() => {}} interactive={false} size={22} />
              <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "8px 0 24px" }}>
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
              {dist.map((d) => (
                <div key={d.star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, width: 20, textAlign: "right", color: "var(--color-text-secondary)" }}>{d.star}</span>
                  <StarIcon filled size={14} />
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--color-border)", overflow: "hidden" }}>
                    <div style={{ width: `${d.pct}%`, height: "100%", borderRadius: 4, background: "var(--gradient-brand)", transition: "width 0.5s ease" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", width: 28, textAlign: "right" }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Form */}
          <div className="col-lg-7">
            <div className="dash-section-card" style={{ padding: 32 }}>
              <h4 style={{ marginBottom: 4 }}>Leave a review</h4>
              <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 20 }}>
                Share your experience with Saurellius
              </p>

              {submitted && (
                <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--color-success)", fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
                  Thank you! Your review has been submitted.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                    Your Rating
                  </label>
                  <StarRating value={rating} onChange={setRating} size={32} />
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Name</label>
                      <input type="text" className="form-control" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Email</label>
                      <input type="email" className="form-control" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>Your Review</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Tell us about your experience..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && (
                  <p style={{ color: "var(--color-error)", fontSize: 13, marginBottom: 12 }}>{error}</p>
                )}

                <button type="submit" className="btn btn-secondary" disabled={submitting} style={{ minWidth: 160 }}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="spinner-border text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--color-text-tertiary)" }}>
            <p style={{ fontSize: 18 }}>No reviews yet. Be the first!</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24 }}>
              All Reviews ({reviews.length})
            </h3>
            <div className="row" style={{ gap: "24px 0" }}>
              {reviews.map((review, i) => (
                <div className="col-md-6 col-lg-4" key={review._id || i}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
