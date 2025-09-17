import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from './config/apiConfig';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import circle from './images/circle.png';
import home from './images/HOME.png';

const SubFolderUpload = () => {
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const projectId = localStorage.getItem('nProject');
    const { hubType } = useParams();
    const prototypeType = hubType;
    const [loading, setLoading] = useState(false);

    const access_token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(access_token);
    const userId = decodedToken.userId;

    const inputFileRef = useRef(null); // Ref for the input element

    const onDrop = useCallback((acceptedFiles) => {
        const newImages = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
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

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
        noClick: true, // Prevent the default click behavior
    });

    const handleSubmit = () => {
        console.log('Submitting images:', images);
        handleUpload();
    };

    const handleUpload = async () => {
        setLoading(true);
        for (let index = 0; index < images.length; index++) {
            const selectedFile = images[index];
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('type', prototypeType);
            formData.append('projectId', projectId);
            formData.append('sequence', index); // Use the index as the sequence number
            formData.append('imageName', selectedFile.name); // Use the file name as the image name

            try {
                const response = await axios.post(`${API_BASE_URL}/api/pitchDeck/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${access_token}`,
                    }
                });
                console.log(response);
                toast.success("Image Uploaded");
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                setLoading(false);
            }
        }

        if (prototypeType === "Prototype") {
            navigate('/prototype');
        } else if (prototypeType === "Wireframe") {
            navigate('/wireframe');
        }
    };

    return (
        <>
            <div className='container relative'>
                <div className="absolute inset-0 mt-[60px] ml-[-20px] z-[-100] bg-no-repeat bg-cover w-[200px] h-[200px]" style={{ backgroundImage: `url(${circle})` }}></div>
                <div className="flex mt-[40px] justify-between items-center w-[100%]">
                    <div className="w-fit">
                        <button onClick={() => navigate(-1)} className='bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl'>
                            Back
                        </button>
                    </div>
                    <div>
                        <img src={home} alt="Home Icon" />
                    </div>
                </div>
                <div className='coverPit'>
                    <DndProvider backend={HTML5Backend}>
                        <div className="upload-container">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} ref={inputFileRef} />
                                <p>Drag and drop some files here, or click to select files</p>
                            </div>

                            {/* Clicking on this button will open the file dialog */}
                            <div onClick={() => inputFileRef.current.click()} className="upload-button bg-[#EEEEEE] border-dashed border-[black] border-[1px] w-[20rem] m-auto ">
                                <p className='hover:cursor-pointer text-[#B0B0B0] text-[50px]'  > + </p>
                            </div>

                            <div className="images-preview">
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

                            {loading ? (
                                <button disabled={true} className='submit-button'>
                                    <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />
                                </button>
                            ) : (
                                <button onClick={handleSubmit} className='submit-button rounded-3xl '>Upload file</button>
                            )}
                        </div>
                    </DndProvider>
                </div>
                <Toaster position="top-right" />
            </div>
        </>
    );
};

const ImagePreview = ({ image, index, moveImage, removeImage }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: 'image',
        hover(item) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveImage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'image',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div ref={ref} className="image-preview" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <img src={image.preview} alt={`preview-${index}`} />
            <button className="remove-button" onClick={() => removeImage(index)}>x</button>
        </div>
    );
};

export default SubFolderUpload;
