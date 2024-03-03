const Modal = ({ image, onClose }) => {
  if (!image) {
    return null;
  }
  {
    console.log(image);
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={image.url} alt="Selected" />
        <p>created_at: {image.created_at}</p>
        <p>description: {image.description}</p>
        <p>Likes: {image.likes}</p>
      </div>
    </div>
  );
};

export default Modal;
