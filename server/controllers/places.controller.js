import Place from '../models/places.model.js'

// Get all places (existing)
export const getPlaces = async (req, res) => {
  try {
    const { country, city, category } = req.query;
    let query = {};

    if (country) {
      query.country = new RegExp(country, 'i');
    }
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    const places = await Place.find(query)
      .sort('-rating')
      .select('-reviews');
    res.json(places);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single place (existing)
export const getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add review (existing)
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    place.reviews.push(review);
    place.rating = place.reviews.reduce((acc, item) => item.rating + acc, 0) / place.reviews.length;

    await place.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search nearby (existing)
export const searchNearby = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    const places = await Place.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json(places);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add new place
export const addPlace = async (req, res) => {
  try {
    const {
      name, state, country, description, image,
      price, featured, location, amenities, category
    } = req.body;

    if (!name || !state || !country || !description || !image || !price || !location || !category) {
      console.error("Validation Error: Missing required fields", req.body);
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const place = new Place({
      name,
      state,
      country,
      description,
      image,
      price,
      featured: featured || false,
      location,
      amenities: amenities || [],
      category
    });

    await place.save();
    res.status(201).json({ message: 'Place added successfully', place });
  } catch (error) {
    console.error("Error adding place:", error); // Log the full error
    res.status(400).json({ message: error.message });
  }
};


// Update place
export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      place[key] = updates[key];
    });

    await place.save();
    res.json({ message: 'Place updated successfully', place });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete place
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
