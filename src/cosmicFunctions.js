import Cosmic from "cosmicjs";

export async function getCosmicJsData() {
  const api = Cosmic();
  const bucket = api.bucket({
    slug: process.env.REACT_APP_COSMIC_BUCKET
  });
  const arrayOfAllObjectsInBucket = (await bucket.getObjects()).objects;
  return organizeCosmicJsDataByObjectType(arrayOfAllObjectsInBucket);
}

function organizeCosmicJsDataByObjectType(arrayOfCosmicJsData) {
  //maps through array of objects, returns object with property for
  //each slug-type, with the value being an array of the objects

  let organizedData = {};
  arrayOfCosmicJsData.map((object) => {
    const typeSlug = object.type_slug;
    //eslint-disable-next-line
    organizedData.hasOwnProperty(typeSlug)
      ? ""
      : (organizedData[typeSlug] = []);
    organizedData[typeSlug].push(object);
    return organizedData;
  });
  return organizedData;
}

// export function matchPostObjectToPostIndex(targetPostObject, arrayOfPostObjects) {
//   //receives a target post object and the array of posts from cosmic. matches
//   //the _id of the post object and returns the index for that object
//   //in the array. Use so otherPosts can tell featuredPost which one
//   //we care about
//   let returnIndex = 0;
//   arrayOfPostObjects.map((postObject, index) => {
//     //eslint-disable-next-line
//     return targetPostObject._id === postObject._id ? returnIndex = index : '';
//   })
//   return returnIndex
// }
