import Parking from '../models/Parking.js';
import User from '../models/User.js';

export const getParkings = async (req, res) => {
  const { city, type, minPrice, maxPrice, sort } = req.query;
  console.log(`[DEBUG] GET /parkings - city parameter: ${city}`);

  let query = {};
  if (city) {
    query.city = new RegExp(city, 'i');
  }
  if (type) query.type = type;
  if (minPrice || maxPrice) {
    query.pricePerHour = {};
    if (minPrice) query.pricePerHour.$gte = Number(minPrice);
    if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
  }

  let result = Parking.find(query);
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    result = result.sort(sortBy);
  } else {
    result = result.sort('-createdAt');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const parkings = await result;
  const total = await Parking.countDocuments(query);

  res.json({
    success: true,
    data: parkings,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
};

export const getNearbyParkings = async (req, res) => {
  const { lat, lng, dist = 5000 } = req.query;
  if (!lat || !lng) {
    res.status(400);
    throw new Error('Veuillez fournir la latitude et la longitude');
  }
  const parkings = await Parking.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(dist),
      },
    },
  });
  res.json({ success: true, data: parkings });
};

export const getParkingById = async (req, res) => {
  const parking = await Parking.findById(req.params.id).populate('owner', 'name avatar');
  if (parking) {
    res.json({ success: true, data: parking });
  } else {
    res.status(404);
    throw new Error('Parking non trouvé');
  }
};

export const createParking = async (req, res) => {
  const parking = await Parking.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: parking, message: 'Parking ajouté avec succès' });
};

export const seedParkings = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not available in production' });
  }

  const owner = await User.findOne({ role: 'owner' });
  if (!owner) {
    return res.status(400).json({ success: false, message: 'Please create an owner user first' });
  }

  const sampleParkings = [
    {
      title: "Parking Maarif Center",
      address: "Rue de la Mer, Casablanca",
      city: "Casablanca",
      pricePerHour: 10,
      type: "garage",
      status: "available",
      images: ["https://images.unsplash.com/photo-1506521781263-d8422e82f27a"],
      location: { type: "Point", coordinates: [-7.6299, 33.5849] },
      owner: owner._id,
      description: "Parking sécurisé en plein centre du Maarif.",
      features: ["camera", "guarded"]
    },
    {
      title: "Parking Tour Hassan",
      address: "Avenue Tour Hassan, Rabat",
      city: "Rabat",
      pricePerHour: 12,
      type: "rue",
      status: "available",
      images: ["https://images.unsplash.com/photo-1574187010467-334346e4575f"],
      location: { type: "Point", coordinates: [-6.8225, 34.0244] },
      owner: owner._id,
      description: "Places disponibles près de la Tour Hassan.",
      features: ["24/7"]
    },
    {
      title: "Parking Guéliz",
      address: "Avenue Mohammed V, Marrakech",
      city: "Marrakech",
      pricePerHour: 15,
      type: "sous-sol",
      status: "limited",
      images: ["https://images.unsplash.com/photo-1597212618440-8062a284ef43"],
      location: { type: "Point", coordinates: [-8.0083, 31.6346] },
      owner: owner._id,
      description: "Parking souterrain moderne à Guéliz.",
      features: ["camera", "electric"]
    }
  ];

  await Parking.deleteMany({ city: { $in: ["Casablanca", "Rabat", "Marrakech"] } });
  const created = await Parking.insertMany(sampleParkings);

  res.status(201).json({ success: true, data: created, message: '10 parkings de test insérés' });
};
