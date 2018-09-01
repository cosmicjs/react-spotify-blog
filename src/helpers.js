import Cosmic from 'cosmicjs';

export async function getCosmicJsData() {
	console.log("process.env.REACT_APP_COSMIC_BUCKET ",process.env.REACT_APP_COSMIC_BUCKET);
	console.log("process.env.NODE_ENV ",process.env.NODE_ENV);


    const api = Cosmic()
    const bucket = api.bucket({
      slug: process.env.REACT_APP_COSMIC_BUCKET
    })
    const objects = (await bucket.getObjects()).objects;
    console.log("objects ''",objects);
    return objects
  }