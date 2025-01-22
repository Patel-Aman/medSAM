# medSAM Application

This application provides a backend and frontend for running the MedSAM machine learning model to perform segmentation tasks. Below are the steps to set up and run the application.

## Clone the Repository
```bash
git clone https://github.com/GochaLearningSpace/Aman_Gocha
cd Aman_Gocha
```

## Switch to the `medsam` Branch
```bash
git checkout medsam
```

---

## Backend Setup

Navigate to the backend directory:
```bash
cd medSAM
cd backend
```

### Installation
1. **Create a virtual environment:**
   ```bash
   conda create -n medsam python=3.10 -y
   conda activate medsam
   ```

2. **Install PyTorch 2.0:**
   Follow the instructions from the [PyTorch website](https://pytorch.org/get-started/locally/) to install the appropriate version for your system.

3. **Install dependencies:**
   ```bash
   pip install -e .
   ```

4. **Start the backend server:**
   ```bash
   python3 api.py
   ```

---

## Frontend Setup

Navigate to the frontend directory:
```bash
cd medSAM
cd frontend
```

### Installation
1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## Application Usage
- Use the provided endpoints to upload images and perform segmentation tasks via the frontend interface.
- Ensure the backend server is running before starting the frontend.

---

## Additional Notes
- Ensure you have the required CUDA drivers installed if using GPU for processing.
- Adjust the `api.py` or frontend configuration if running on non-default ports or IPs.

