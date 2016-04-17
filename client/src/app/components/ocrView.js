import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import Webcam from 'react-webcam';
import Debug from 'debug';
import OcrResult from 'components/ocrResult';

let debug = new Debug("view:ocr");

export default React.createClass( {
    getInitialState() {
        return {
                ocr: null,
                completed: 0,
                loading:false,
                progress: false,
                webcam:false

        };
    },
    renderWebcam(){
        if(this.state.webcam){
            return (<Webcam audio={false} ref='webcam' width='424' height='320' screenshotFormat='image/jpeg'/>)
        } else {

        }
    },
    renderInputButton(){
        return (<div>
                    <RaisedButton
                              label="Choose a file"
                              onClick={ this.chooseFile }
                              icon={<FontIcon className=""/>}
                           />
                    <input
                         ref="fileUpload"
                         type="file"
                         style={{display : "none"}}
                         onChange={this.onFileSelected}/>
                     {!this.state.webcam && <RaisedButton
                                   label="Take a picture"
                                   onClick={ this.showWebCam }
                                   icon={<FontIcon className=""/>}
                                />}
                     {this.state.webcam && <RaisedButton
                               label="Take a screenshot"
                               onClick={ this.takePicture }
                               icon={<FontIcon className=""/>}
                            />}
                 </div>
        );
    },
    render() {
        return (
            <div className="ocr-view">

                {!this.state.loading && this.renderInputButton()}
                <OcrResult {...this.state}></OcrResult>
                <img ref='screenshot'
                    className='thumb'
                    onLoad={this.onLoadImage}
                    id='screenshot'
                    src={this.state.screenshot} />
                {this.renderWebcam()}

                 <div id='id-image'>
                 </div>
             </div>
     )
    },
    onLoadImage(){
        let img = ReactDOM.findDOMNode(this.refs.screenshot);
        debug("onLoadImage: ");
        Tesseract.recognize(img, {
            progress: progress => {
                debug("ocr ...", progress)
                this.setState({completed: progress.recognized})
            }
        }).then(result => {
            this.setState({ocr: result, completed: 0, loading: false})
            this.props.onResult(result);
        })
    },
    chooseFile(){
        debug("chooseFile: ");
        let fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
        fileUploadDom.click();
    },
    showWebCam(){
        debug("showWebCam: ");
        this.setState({screenshot: null, webcam: true});
    },
    takePicture(){
        debug("takePicture: ");
        let screenshot = this.refs.webcam.getScreenshot();
        this.setState({screenshot: screenshot, webcam: false});
    },

    onFileSelected(event){
        debug("onFileSelected: ", event.target.value);

        let files = event.target.files;
        debug("onFileSelected: #files ", files.length);
        for (let i = 0, file; file = files[i]; i++) {
            debug("onFileSelected: name", file);
            if (!file.type.match('image.*')) {
              continue;
            }
            this.setState({loading:true})
            let reader = new FileReader();

            reader.onload = (theFile => {
                return (e) => {
                    debug("onload:", e.target.result.length);
                    this.setState({screenshot: e.target.result});
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
} );
