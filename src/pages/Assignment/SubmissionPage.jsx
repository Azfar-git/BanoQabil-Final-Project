import React from 'react';
import { Box, Typography, Button, Card, CardContent, Stepper, Step, StepLabel } from '@mui/material';
import { motion } from 'framer-motion';

export default function SubmissionPage() {
  const steps = ['Upload Files', 'Review', 'Submit'];
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-2xl mx-auto">
          <Box className="mb-8">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
              📤 Submit Assignment
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Follow the steps below to submit your work
            </Typography>
          </Box>

          <Card className="dark:bg-gray-800 mb-6">
            <CardContent className="p-8">
              <Stepper activeStep={activeStep} className="mb-8">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box className="p-6 bg-gray-50 dark:bg-gray-700 rounded mb-6 text-center">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  {activeStep === 0 && 'Upload Your Files'}
                  {activeStep === 1 && 'Review Your Submission'}
                  {activeStep === 2 && 'Submit Your Work'}
                </Typography>
                <Typography className="text-gray-600 dark:text-gray-400 mb-4">
                  {activeStep === 0 && 'Drag and drop files or click to browse'}
                  {activeStep === 1 && 'Make sure everything is correct before submitting'}
                  {activeStep === 2 && 'You are ready to submit!'}
                </Typography>
                <Box className="h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                  <Typography className="text-gray-500 dark:text-gray-400">
                    {activeStep === 0 && 'Drop files here or click to upload'}
                    {activeStep === 1 && 'Files ready for review'}
                    {activeStep === 2 && 'Confirm submission'}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex gap-4 justify-end">
                <Button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Back
                </Button>
                <Button
                  variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold"
                  onClick={() => setActiveStep(activeStep + 1)}
                  disabled={activeStep === steps.length - 1}
                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
