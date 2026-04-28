// Image imports mapping for blog posts
import Coffee_new from '../assets/Coffee_new.png';
import coffe_blog1 from '../assets/coffe_blog1.avif';
import blog1inside1 from '../assets/blog1inside1.jpg';
import blog1inside2 from '../assets/blog1inside2.jpg';
import blog2 from '../assets/blog2.jpg';
import blog2inside1 from '../assets/blog2inside1.jpg';
import blog2inside2 from '../assets/blog2inside2.jpg';
import blog3 from '../assets/blog3.jpg';
import blog3inside1 from '../assets/blog3inside1.jpg';
import blog3inside3 from '../assets/blog3inside3.jpg';
import blog4 from '../assets/blog4.jpg';
import blog4inside1 from '../assets/blog4inside1.jpg';
import blog4inside2 from '../assets/blog4inside2.jpg';
import blog5 from '../assets/blog5.jpg';
import blog5inside1 from '../assets/blog5inside1.jpg';
import blog5inside2 from '../assets/blog5inside2.jpg';
import blog6 from '../assets/blog6.jpg';
import blog6inside1 from '../assets/blog6inside1.jpg';
import blog6inside2 from '../assets/blog6inside2.jpg';
import blog7 from '../assets/blog7.jpg';
import blog7inside1 from '../assets/blog7inside1.jpg';
import blog7inside2 from '../assets/blog7inside2.jpg';
import blog8 from '../assets/blog8.jpg';
import blog8inside1 from '../assets/blog8inside1.jpg';
import blog8inside2 from '../assets/blog8inside2.jpg';
import blog9inside1 from '../assets/blog9inside1.jpg';
import blog9inside2 from '../assets/blog9inside2.jpg';
import blog10 from '../assets/blog10.jpg';
import blog10inside1 from '../assets/blog10inside1.jpg';
import blog10inside2 from '../assets/blog10inside2.jpg';
import blog11 from '../assets/blog11.jpg';
import blog11inside1 from '../assets/blog11inside1.jpg';
import blog11inside2 from '../assets/blog11inside2.jpg';
import blog12 from '../assets/blog12.jpg';
import blog12inside1 from '../assets/blog12inside1.jpg';
import blog12inside2 from '../assets/blog12inside2.jpg';
import dryfruitshero from '../assets/dryfruitshero.jpg';
import ploughing from '../assets/ploughing.gif';
import harvesting from '../assets/harvesting.gif';
import nutrient from '../assets/nutrient.gif';
import almond from '../assets/almond.png';
import sowing from '../assets/sowing.gif';
import spices from '../assets/spices.png';
import pulseshero from '../assets/pulseshero.jpg';
import dryfruits from '../assets/dryfruits.png';
import jeggary from '../assets/jeggary.png';
import fssai from '../assets/fssai.png';
import irrigation from '../assets/irrigation.gif';
import protecting from '../assets/protecting.gif';
import storage from '../assets/storage.gif';
import Pure_jaggary from '../assets/Pure_jaggary.png';
import jaggary2 from '../assets/jaggary2.jpg';
import iso from '../assets/iso.png';

export const imageMap = {
  'Coffee_new.png': Coffee_new,
  'coffe_blog1.avif': coffe_blog1,
  'blog1inside1.jpg': blog1inside1,
  'blog1inside2.jpg': blog1inside2,
  'blog2.jpg': blog2,
  'blog2inside1.jpg': blog2inside1,
  'blog2inside2.jpg': blog2inside2,
  'blog3.jpg': blog3,
  'blog3inside1.jpg': blog3inside1,
  'blog3inside3.jpg': blog3inside3,
  'blog4.jpg': blog4,
  'blog4inside1.jpg': blog4inside1,
  'blog4inside2.jpg': blog4inside2,
  'blog5.jpg': blog5,
  'blog5inside1.jpg': blog5inside1,
  'blog5inside2.jpg': blog5inside2,
  'blog6.jpg': blog6,
  'blog6inside1.jpg': blog6inside1,
  'blog6inside2.jpg': blog6inside2,
  'blog7.jpg': blog7,
  'blog7inside1.jpg': blog7inside1,
  'blog7inside2.jpg': blog7inside2,
  'blog8.jpg': blog8,
  'blog8inside1.jpg': blog8inside1,
  'blog8inside2.jpg': blog8inside2,
  'blog9inside1.jpg': blog9inside1,
  'blog9inside2.jpg': blog9inside2,
  'blog10.jpg': blog10,
  'blog10inside1.jpg': blog10inside1,
  'blog10inside2.jpg': blog10inside2,
  'blog11.jpg': blog11,
  'blog11inside1.jpg': blog11inside1,
  'blog11inside2.jpg': blog11inside2,
  'blog12.jpg': blog12,
  'blog12inside1.jpg': blog12inside1,
  'blog12inside2.jpg': blog12inside2,
  'dryfruitshero.jpg': dryfruitshero,
  'ploughing.gif': ploughing,
  'harvesting.gif': harvesting,
  'nutrient.gif': nutrient,
  'almond.png': almond,
  'sowing.gif': sowing,
  'spices.png': spices,
  'pulseshero.jpg': pulseshero,
  'dryfruits.png': dryfruits,
  'jeggary.png': jeggary,
  'fssai.png': fssai,
  'irrigation.gif': irrigation,
  'protecting.gif': protecting,
  'storage.gif': storage,
  'Pure_jaggary.png': Pure_jaggary,
  'jaggary2.jpg': jaggary2,
  'iso.png': iso,
};

export const getImage = (imageName) => {
  return imageMap[imageName] || null;
};

