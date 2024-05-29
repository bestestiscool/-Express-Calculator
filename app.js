const express = require('express');
const ExpressError = require('./expressError');
const app = express();

app.use(express.json());

// Helper function to parse query parameter
function parseNumbers(numsStr) {
  if (!numsStr) throw new ExpressError("Nums are required", 400);
  let nums = numsStr.split(',').map(num => {
    let parsed = parseFloat(num);
    if (isNaN(parsed)) throw new ExpressError(`'${num}' is not a valid number.`, 400);
    return parsed;
  });
  return nums;
}

// Function to calculate mean
function calculateMean(nums) {
  let sum = nums.reduce((acc, num) => acc + num, 0);
  return sum / nums.length;
}

// Function to calculate median
function calculateMedian(nums) {
  nums.sort((a, b) => a - b);
  let mid = Math.floor(nums.length / 2);
  if (nums.length % 2 === 0) {
    return (nums[mid - 1] + nums[mid]) / 2;
  } else {
    return nums[mid];
  }
}

// Function to calculate mode
function calculateMode(nums) {
  let freq = {};
  nums.forEach(num => freq[num] = (freq[num] || 0) + 1);
  let maxCount = 0;
  let modes = [];
  for (let num in freq) {
    if (freq[num] > maxCount) {
      modes = [num];
      maxCount = freq[num];
    } else if (freq[num] === maxCount) {
      modes.push(num);
    }
  }
  return modes.length === nums.length ? "No mode" : modes;
}

// Route to calculate mean
app.get('/mean', (req, res, next) => {
  try {
    let nums = parseNumbers(req.query.nums);
    let result = calculateMean(nums);
    return res.json({ response: { operation: "mean", value: result } });
  } catch (e) {
    next(e);
  }
});

// Route to calculate median
app.get('/median', (req, res, next) => {
  try {
    let nums = parseNumbers(req.query.nums);
    let result = calculateMedian(nums);
    return res.json({ response: { operation: "median", value: result } });
  } catch (e) {
    next(e);
  }
});

// Route to calculate mode
app.get('/mode', (req, res, next) => {
  try {
    let nums = parseNumbers(req.query.nums);
    let result = calculateMode(nums);
    return res.json({ response: { operation: "mode", value: result } });
  } catch (e) {
    next(e);
  }
});

// 404 handler for all other routes
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

// Error-handling middleware
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({
    error: { message, status }
  });
});

app.listen(3300, () => {
  console.log("Server running on port 3000");
});
