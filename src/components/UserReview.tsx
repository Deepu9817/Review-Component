import { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";

interface Review {
  name: string;
  rating: number;
  feedback: string;
}

const UserReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState<Review>({name: "", rating: 5, feedback: "",});
  const [errors, setErrors] = useState<{ name: string; feedback: string }>({name: "", feedback: "",});

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    setReviews(storedReviews);
  }, []);

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", feedback: "" };

    if (newReview.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    }
    if (newReview.feedback.trim().length < 3) {
      newErrors.feedback = "Feedback must be at least 3 characters";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setShowForm(false);
    setNewReview({ name: "", rating: 5, feedback: "" });
    setErrors({ name: "", feedback: "" });
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedReviews = reviews.filter((_, index) => index !== indexToDelete);
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="container my-4 w-50">
      
      <button className="btn btn-outline-primary" onClick={() => setShowForm(true)}> Share Your Feedback </button>
      
      {showForm && (
        <div className="mt-4 p-4 border rounded">
          
          <input type="text" className="form-control" placeholder="Name" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}/>
          {errors.name && <small className="text-danger">{errors.name}</small>}
          <br />
         
          <Rating name="half-rating" defaultValue={2.5} precision={0.5} value={newReview.rating} onChange={(_, newValue) => setNewReview({ ...newReview, rating: newValue || 1 })} />
          
          <textarea className="form-control mt-3" placeholder="Feedback" value={newReview.feedback} onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}/>
          {errors.feedback && (<small className="text-danger">{errors.feedback}</small>)}
          
          <br></br>
          
          <button className="btn btn-outline-success mt-2" onClick={handleSubmit}> Submit </button>
        </div>
      )}

      <div className="mt-4 d-flex justify-content-between align-items-center">
        
        {reviews.length > 2 && (
          <button className="btn btn-outline-secondary rounded-circle" onClick={handlePrev}> {"<"} </button>
        )}

        <div className="d-flex gap-3">
          {reviews.length > 0 && [0, 1].map((offset) => {
              const index = (currentIndex + offset) % reviews.length;
              const review = reviews[index];
              return review ? (
                <div key={index} className="card" style={{ width: "18rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">{review.name}</h5>
                    <Rating name="read-only" value={review.rating} precision={0.5} readOnly />
                    <p className="card-text">{review.feedback}</p>
                    <button className="btn btn-outline-danger mt-2" onClick={() => handleDelete(index)}> Delete </button>
                  </div>
                </div>
              ) : null;
            })}
        </div>

        {reviews.length > 2 && (
          <button className="btn btn-outline-secondary rounded-circle" onClick={handleNext}> {">"} </button>
        )}
      </div>
    </div>
  );
};

export default UserReview;
