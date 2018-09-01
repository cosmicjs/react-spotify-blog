import Cosmic from 'cosmicjs';

export async function getCosmicJsData() {
    const api = Cosmic()
    const bucket = api.bucket({
      slug: process.env.REACT_APP_COSMIC_BUCKET
    })
    const arrayOfAllObjectsInBucket = (await bucket.getObjects()).objects;

    return organizeCosmicJsDataByObjectType(arrayOfAllObjectsInBucket);
  }

function organizeCosmicJsDataByObjectType(arrayOfCosmicJsData) {
  //maps through array of objects, returns object with property for
  //each slug-type, with the value being an array of the objects

  let organizedData = {};
  arrayOfCosmicJsData.map((object) => {
    const typeSlug = object.type_slug;
    organizedData.hasOwnProperty(typeSlug) ? '': organizedData[typeSlug] = [];
    organizedData[typeSlug].push(object)
  })
  return organizedData;
}


