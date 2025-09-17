import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./config/apiConfig";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Header from "./component/header";
import BreadCrumb from "./component/breadCrumb";

const ImageUpload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const projectId = localStorage.getItem("nProject");
  const prototypeType = localStorage.getItem("selectedPrototype");
  const access_token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const moveImage = (dragIndex, hoverIndex) => {
    const dragImage = images[dragIndex];
    const updatedImages = [...images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, dragImage);
    setImages(updatedImages);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true
  });

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      for (let index = 0; index < images.length; index++) {
        const selectedFile = images[index];
        const formData = new FormData();

        formData.append("image", selectedFile);
        formData.append("type", "Branding");
        formData.append("sequence", index);
        formData.append("projectId", projectId);
        formData.append("imageName", selectedFile.name);

        await axios.post(`${API_BASE_URL}/api/hub/brand`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`
          }
        });
      }

      toast.success("All images uploaded successfully");
      setImages([]); // Clear uploaded images
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload one or more images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    handleUpload();
  };

  return (
    <>
      <Header />
      <BreadCrumb page={"Upload Logo Variations"} />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10 px-4">
        <Toaster richColors position="top-right" />
        <DndProvider backend={HTML5Backend}>
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-600">
              Upload Logo Variations
            </h1>

            <div
              {...getRootProps()}
              className="border-2 border-dashed border-blue-600 p-10 text-center rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition mb-6"
            >
              <input {...getInputProps()} />
              <p className="text-blue-600 font-semibold text-lg">
                Drag & drop images here, or click to browse
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <ImagePreview
                    key={index}
                    index={index}
                    image={image}
                    moveImage={moveImage}
                    removeImage={removeImage}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-3 rounded-full font-semibold text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition text-base sm:text-lg`}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      spin
                      className="mr-2"
                    />
                    Uploading...
                  </>
                ) : (
                  "Submit Images"
                )}
              </button>
            </div>
          </div>
        </DndProvider>
      </div>
    </>
  );
};

const ImagePreview = ({ image, index, moveImage, removeImage }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "image",
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="relative border rounded overflow-hidden shadow hover:shadow-md transition"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img
        src={image.preview}
        alt={`preview-${index}`}
        className="w-full h-32 object-cover"
      />
      <button
        onClick={() => removeImage(index)}
        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
      >
        ×
      </button>
    </div>
  );
};

export default ImageUpload;
