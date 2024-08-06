import { IonIcon } from "@ionic/react";
import Header from "../components/Header";
import {
  arrowBackOutline,
  imageOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import api from "../api";

export default function Create() {
  const navigate = useNavigate();

  const [pin, setPin] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const fileUpload = useRef();

  async function onImageChange(e) {
    setError(null);
    if (!(e.target.files && e.target.files[0])) return;
    setPin(e.target.files[0]);
  }

  async function handleCreatePin(e) {
    try {
      e.preventDefault();
      if (!pin) return setError("Please add a pin");
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('pin', pin)
      const response = await api.post("/api/pin/create", formData);
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 1rem",
          gap: "1rem",
          width: "fit-content",
          // position: "fixed",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={(e) => navigate(-1)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
              borderRadius: 32,
              width: "1.8rem",
              height: "1.8rem",
              opacity: 0,
              position: "absolute",
              zIndex: 1,
              transition: "all 150ms",
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 0;
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 0.1;
            }}
          />
          <IonIcon icon={arrowBackOutline} />
        </div>
        <h3 style={{ fontWeight: 600 }}>Back</h3>
      </div>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 100,
        }}
        onSubmit={async (e) => handleCreatePin(e)}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "fit-content",
            borderRadius: 32,
            boxShadow: "rgb(211 211 211) 0px 0px 20px 0px",
          }}
        >
          {/* Pin */}
          <div
            style={{
              position: "relative",
              width: 508,
              borderRadius: 32,
              padding: 20,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {pin ? (
              <img
                src={pin ? URL.createObjectURL(pin) : ""}
                style={{
                  width: "100%",
                  height: "min-content",
                  objectFit: "contain",
                  display: "flex",
                  borderRadius: 16,
                  objectPosition: "top",
                  cursor: "pointer",
                }}
                onClick={(e) => fileUpload.current.click()}
              />
            ) : (
              <div
                style={{
                  // position: "absolute",
                  width: 468,
                  height: 512,
                  backgroundColor: "rgb(251 251 251)",
                  borderWidth: 3,
                  borderColor: "#e9e9e9",
                  borderRadius: 32,
                  borderStyle: "dashed",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => fileUpload.current.click()}
              >
                <IonIcon
                  icon={imageOutline}
                  style={{ fontSize: 32, opacity: 0.5 }}
                />
                <div style={{ opacity: 0.9 }}>Click to add a pin</div>
              </div>
            )}
          </div>
          {/* Title and comments container */}
          <div
            style={{
              width: 508,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              position: "relative",
              padding: 32,
              gap: 8,
            }}
          >
            <input
              name="pin"
              ref={fileUpload}
              type="file"
              onChange={e => onImageChange(e)}
              style={{ display: "none" }}
            />
            <div className="input-container">
              <label htmlFor="title">Title</label>
              <input
                name="title"
                id="title"
                maxLength={64}
                minLength={1}
                className="input"
                placeholder="Title"
                required
                autoComplete="false"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                maxLength={1000}
                minLength={1}
                style={{ height: 500 }}
                placeholder="Description"
                required
                autoComplete="false"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {error && (
              <div style={{ color: "red", alignSelf: "center" }}>{error}</div>
            )}
            <button
              type="submit"
              className="red-button"
              style={{ width: "50%", alignSelf: "center" }}
            >
              Create
            </button>
            <button
              className="grey-button"
              style={{ width: "50%", alignSelf: "center" }}
              onClick={(e) => {
                navigate(-1);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
