import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import Debug from 'debug';
import OcrResult from 'components/ocrResult';

let debug = new Debug("view:ocr");

export default React.createClass( {
    getInitialState() {
        return {
                ocr: null,
                completed: 0,
                loading:false,
                progress: false
        };
    },
    renderInputButton(){
        return (<div>
                    <RaisedButton
                              label="Take a picture"
                              onClick={ this.takePicture }
                              icon={<FontIcon className=""/>}
                           />
                    <input
                         ref="fileUpload"
                         type="file"
                         style={{display : "none"}}
                         onChange={this.onFileSelected}/>
                 </div>
        );
    },
    render() {
        return (
            <div className="ocr-view">

                {!this.state.loading && this.renderInputButton()}

                 <div id='id-image'>

                 </div>
                 <OcrResult {...this.state}></OcrResult>

             </div>
     )
    },
    takePicture(){
        debug("takePicture: ");
        let fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
        fileUploadDom.click();
    },
    onFileSelected(event){
        debug("onFileSelected: ", event.target.value);
        let files = event.target.files;
        for (let i = 0, file; file = files[i]; i++) {
            debug("onFileSelected: name", file);
            // Only process image files.
            if (!file.type.match('image.*')) {
              continue;
            }
            this.setState({loading:true})
            let reader = new FileReader();

            reader.onload = (theFile => {
                return (e) => {

                    let span = document.createElement('span');
                    span.innerHTML = [
                        '<img id="image" class="thumb" src="',
                        e.target.result,
                        '" title="',
                        escape(theFile.name),
                        '"/>'
                    ].join('');
                    document.getElementById('id-image').insertBefore(span, null);

                    let img = new Image();
                    img.src = document.getElementById('image').src;

                    img.onload = () => {
                        Tesseract.recognize(img, {
                            progress: progress => {
                                debug("ocr ...", progress)
                                this.setState({completed: progress.recognized})
                            }
                        }).then(result => {
                            this.setState({ocr: result, completed: 0, loading: false})
                            this.props.onResult(result);
                        })
                    }
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
} );
