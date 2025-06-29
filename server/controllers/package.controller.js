import Package from '../models/package.model.js';

export const createPackage = async (req, res) => {
    try {
        const newPackage = new Package({
            ...req.body,
            agency: req.user._id
        });
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPackages = async (req, res) => {
    try {
        const { destination, minPrice, maxPrice, difficulty } = req.query;
        let query = {};

        if (destination) {
            query.destination = new RegExp(destination, 'i');
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }

        const packages = await Package.find(query)
            .populate('agency', 'name email')
            .sort('-createdAt');
        res.json(packages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPackage = async (req, res) => {
    try {
        const foundPackage = await Package.findById(req.params.id)
            .populate('agency', 'name email')
            .populate('reviews.user', 'name');

        if (!foundPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(foundPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const foundPackage = await Package.findById(req.params.id);
        if (!foundPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        if (foundPackage.agency.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this package' });
        }

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePackage = async (req, res) => {
    try {
        const foundPackage = await Package.findById(req.params.id);
        if (!foundPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        if (foundPackage.agency.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this package' });
        }

        await Package.findByIdAndDelete(req.params.id);

        res.json({ message: 'Package removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const foundPackage = await Package.findById(req.params.id);

        if (!foundPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const review = {
            user: req.user._id,
            rating: Number(rating),
            comment
        };

        foundPackage.reviews.push(review);
        foundPackage.rating =
            foundPackage.reviews.reduce((acc, item) => item.rating + acc, 0) /
            foundPackage.reviews.length;

        await foundPackage.save();
        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};