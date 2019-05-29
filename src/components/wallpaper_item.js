import React from 'react';

const WallpaperItem = ({file}) => {
    if (file.data.preview) {
        if( file.data.preview.enabled) {
            console.log(file);
            let previewImage = file.data.preview ? file.data.preview.images[0].resolutions[2].url : "http://dummyimage.com";
            previewImage = previewImage.replace(/&amp;/g,"&");
            return (
                <div className="col-sm-12 col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-img-top">
                            {(file.data.over_18) ? <div>NSFW</div> : <img src={previewImage} width="100%" alt={file.data.title}/>}
                        </div>
                    </div>
                    {file.data.name}
                </div>
            );
        }
    }
    return (
        <div></div>
    );
    
} 

export default WallpaperItem;