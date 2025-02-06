
import './App.css';
import { Button } from '@mui/material';
import { useRef, useState } from 'react';
import {Card} from '@mui/material';

function App() {
  const fileInputRef = useRef(null); // Создаем реф для элемента input
  const [image, setImage] = useState(null); // Состояние для хранения изображения
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteImage = () =>{
    setImage(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Получаем выбранный файл
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Устанавливаем изображение в состояние
      };
      reader.readAsDataURL(file); // Читаем файл как URL
    }
  };

  
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Открываем окно выбора файла, когда нажимаем кнопку
  };

  const sendPhotoPredict = async () => {
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const response = await fetch("http://89.110.96.166:80/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data)
      setResult(data); // Получаем результат с сервера
  
    } catch (error) {
      console.error("Ошибка при отправке фотографии:", error);
    }

    console.log(fileInputRef.current.files[0])
  }


  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection:"column"}}>
        <Button 
            onClick={handleButtonClick} 
            variant='contained'
            sx={{
              backgroundColor: '#D49074',
            }}
            color='#5A5A5A'
          >
          Загрузить фотографию
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        {image && (
          <Card 
            onClick={()=> deleteImage()}
            sx={{
              backgroundColor: '#CCB6AD',
              marginTop: "10px",
              padding:"1%",
              
            }}
            color='#5A5A5A'
          >
            <h3>Предпросмотр изображения:</h3>
            <img src={image} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />
          </Card>
        )}
        <Button 
          variant='contained'
          onClick={sendPhotoPredict}
          sx={{
            marginTop: "10px",
            backgroundColor: '#D49074',
          }}
          color='#5A5A5A'
        >
          Проверить
        </Button>
        {result && (
          <div>
            <Card
              sx={{
                marginTop: "10px",
              }}
              color='#5A5A5A'
            >
              <h3>Результат анализа:</h3>
              <p><strong>Диагноз:</strong> {result.predicted_class}</p>
              <p><strong>Уверенность:</strong> {result.confidence}</p>
              <p><strong>Объяснение:</strong> {result.explanation}</p>
            </Card>
            <Card
              sx={{
                  marginTop: "10px",
                }}
                color='#5A5A5A'
              >
              {Object.entries(result.all_predictions).map(([key, value]) => (
                  <p>{key} {value}</p>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
