import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const USER_ID = 'dwlandry';
const PAT = 'ac00516518514b598b770475067f89b8';
const APP_ID = '406685cec419486ea247dcbc9f135da7';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
// const IMAGE_URL = 'https://m.media-amazon.com/images/I/719g-EFSwyL._SL1500_.jpg';


const particlesInit = async (main) => {
  // console.log(main);

  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  // starting from v2 you can add only the features you need reducing the bundle size
  await loadFull(main);
};

const particlesLoaded = (container) => {
  // console.log(container);
};

const particlesOptions = {
  fpsLimit: 120,
  // interactivity: {
  //   events: {
  //     onClick: {
  //       enable: true,
  //       mode: "push",
  //     },
  //     onHover: {
  //       enable: true,
  //       mode: "repulse",
  //     },
  //     resize: true,
  //   },
  //   modes: {
  //     push: {
  //       quantity: 4,
  //     },
  //     repulse: {
  //       distance: 200,
  //       duration: 0.4,
  //     },
  //   },
  // },
  particles: {
    // color: {
    //   value: "#ffffff",
    // },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 4,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800, //800
      },
      value: 100,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "line",
    },
    // size: {
    //   value: { min: 1, max: 5 },
    // },
  },
  detectRetina: true,
}




class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: {}
    }
  }

  calculateFaceLocations = (data) => {
    const faces = JSON.parse(data).outputs[0].data.regions;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const boxes = [];

    console.log('faces', faces);

    faces.forEach(face => {
      const bounding_box = face.region_info.bounding_box;
      const {top_row, right_col, bottom_row, left_col} = bounding_box;
      
      const box = {
        top: top_row * height,
        right: width - (right_col * width),
        bottom: height - (bottom_row * height),
        left: left_col * width,
      }

      boxes.push(box);
    });
    return boxes;
  }

  displayFaceBoxes = (boxes) => {
    console.log(boxes);
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": this.state.input
            }
          }
        }
      ]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    
    fetch("https://api.clarifai.com/v2/models/" 
      + MODEL_ID 
      + "/versions/" 
      + MODEL_VERSION_ID 
      + "/outputs", requestOptions)
    
      .then(response => response.text())
      .then(result => this.displayFaceBoxes(this.calculateFaceLocations(result)))
      .catch(error => console.log('error', error))
  }

  render() {
    const { imageUrl, boxes } = this.state;
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesOptions}
        />
        
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition boxes={boxes} imageUrl={imageUrl} />

      </div>
    );
  }
}

export default App;
