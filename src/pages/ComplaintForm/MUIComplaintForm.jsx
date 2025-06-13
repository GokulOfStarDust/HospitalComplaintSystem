import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL, COMPLAINT_URL, ISSUE_CATEGORY_URL } from '../Url';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  TextField,
  Input,
  Button,
  IconButton,
} from '@mui/material';

const MUIComplaintForm = () => {
  const [decodedData, setDecodedData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [signature, setSignature] = useState(null);
  const [encodedData, setEncodedData] = useState(null);
  const [issueCategories, setIssueCategories] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [sessionId, setSessionId] = useState(null);
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      issue_type: '',
      priority: '',
      description: '',
      upload_file: [],
    },
  });

    useEffect(() => {
        const existingSession = sessionStorage.getItem('sessionId');
        console.log('Checking for existing session:', existingSession);
        if (existingSession) {
            console.log('Existing session found:', existingSession);
            navigate('/sessionExpired');
            return;
        }

        const newSessionId = `session_${Date.now()}`;
        setSessionId(newSessionId);
        sessionStorage.setItem('sessionId', newSessionId);
        setTimeLeft(600);
        console.log('Session started:', newSessionId);
    }, [navigate]);

    useEffect(() => {
        if (timeLeft <= 0) {
            sessionStorage.removeItem('sessionId');
            navigate('/sessionExpired');
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, navigate]);

  const uploadOnChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    setValue('upload_file', updatedFiles);
    e.target.value = null;
  };

  const handleDeleteFile = (indexToDelete) => {
    const updatedFiles = files.filter((_, index) => index !== indexToDelete);
    setFiles(updatedFiles);
    setValue('upload_file', updatedFiles);
  };

  const formSubmitHandler = async (data) => {
    const formData = new FormData();
    formData.append('room_number', decodedData.room_no);
    formData.append('block', decodedData.Block);
    formData.append('bed_number', decodedData.bed_no);
    formData.append('issue_type', data.issue_type);
    formData.append('priority', data.priority);
    formData.append('description', data.description);
    formData.append('floor', decodedData.Floor_no);
    formData.append('ward', decodedData.ward);
    formData.append('room_status', decodedData.status);
    formData.append('speciality', decodedData.speciality);
    formData.append('room_type', decodedData.room_type);
    formData.append('qr_data_from_qr', encodedData);
    formData.append('qr_signature_from_qr', signature);

    files.forEach((file) => {
      formData.append('images', file);
    });

    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log('Form Data to Uploaded:', data);

    try {
      const response = await axios.post(`${BASE_URL}${COMPLAINT_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Complaint submitted successfully:', response.data);
      alert('Complaint submitted successfully!');
      
      // Reset form fields and files state
      reset({
        issue_type: '',
        priority: '',
        description: '',
        upload_file: [],
      });
      setFiles([]); // Clear the files state
    } catch (error) {
      console.error('Error submitting complaint:', error.response?.statusText || error.message);
      alert('Failed to submit complaint. Please try again.');
    }
  };

  const fetchIssueCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${ISSUE_CATEGORY_URL}`);
      const categories = response.data.results;
      setIssueCategories(categories);
      console.log('Issue Categories:', categories);
    } catch (error) {
      console.error('Error fetching issue categories:', error);
      alert('Failed to fetch issue categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchIssueCategories();
  }, []);

  useEffect(() => {
    const base64String = searchParams.get('data');
    setEncodedData(base64String);
    if (!base64String) {
      navigate('/');
      return;
    }

    try {
      const decodedString = atob(base64String);
      const jsonData = JSON.parse(decodedString);
      setSignature(searchParams.get('signature'));
      console.log('Signature:', searchParams.get('signature'));
      console.log('Base64 String:', base64String);
      console.log('Decoded Data:', jsonData);
      setDecodedData(jsonData);
    } catch (error) {
      console.error('Error decoding base64 string:', error);
      navigate('/');
    }
  }, [searchParams, navigate]);

  if (!decodedData) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        Loading...
      </Typography>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 2,
        bgcolor: 'grey.50',
        margin: 'auto',
      }}
    >
      <Box
        component="section"
        sx={{
          width: { xs: '95%', md: '80%', lg: '50%' },
          bgcolor: 'white',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          px: 2,
          boxShadow: 1,
        }}
      >
        <Box
          component="section"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            px: 1,
            py: 2.5,
            gap: 0,
            paddingBottom: 1.2,
            borderBottom: '1px solid #D7D7D7',
          }}
        >
          <Typography variant="body1" sx={{ color: '#202020', fontStyle: 'italic', fontSize: '1rem' }}>
            Raise Ticket
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            Use this form to raise ticket or issue
          </Typography>
        </Box>
        <Box
          component="section"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            p: 1,
            py: 1.5,
            gap: 1,
            borderBottom: '1px solid #D7D7D7',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Room Details
            </Typography>
            <Typography variant="body1" sx={{ color: '#202020' }}>
              {decodedData.Block} Block / Floor {decodedData.Floor_no} / {decodedData.ward} / {decodedData.room_no}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Room Status
            </Typography>
            <Typography variant="body1" sx={{ color: '#202020' }}>
              {decodedData.status === 'active' ? 'Booked' : 'Vacant'}
            </Typography>
          </Box>
        </Box>

        <Box component="section" sx={{ width: '100%', p: 1.5, pt: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(formSubmitHandler)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <FormControl sx={{ width: { xs: '90%', md: '55%' }, gap: 0.5 }}>
              <FormLabel htmlFor="issueType" sx={{ color: 'black' }}>
                Issue Type
              </FormLabel>
              <Controller
                name="issue_type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="issueType"
                    error={!!errors.issue_type}
                    sx={{ borderRadius: '4px', height: '45px' }}
                  >
                    <MenuItem value="" disabled>
                      Select Issue Type
                    </MenuItem>
                    {issueCategories.map((category) => (
                      <MenuItem key={category.issue_category_code} value={category.issue_category_name}>
                        {category.issue_category_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl sx={{ width: { xs: '90%', md: '55%' }, gap: 0.5 }}>
              <FormLabel htmlFor="priority" sx={{ color: 'black' }}>
                Priority
              </FormLabel>
              <Controller
                name="priority"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="priority"
                    error={!!errors.priority}
                    sx={{ borderRadius: '4px', height: '45px' }}
                  >
                    <MenuItem value="" disabled>
                      Select Priority
                    </MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <FormControl sx={{ width: { xs: '90%', md: '55%' }, gap: 0.5 }}>
              <FormLabel htmlFor="description" sx={{ color: 'black' }}>
                Description
              </FormLabel>
              <TextField
                id="description"
                {...register('description', { required: true })}
                error={!!errors.description}
                multiline
                rows={4}
                placeholder="Describe the issue..."
                sx={{ borderRadius: '4px', height: '125px' }}
              />
            </FormControl>

            <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <FormLabel htmlFor="uploadFile">Upload File</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                <Box
                  sx={{
                    display: files.length === 0 ? 'none' : 'flex',
                    flexDirection: 'column',
                    width: '60%',
                    minWidth: 205,
                  }}
                >
                  {files.map((file, index) => (
                    <Box
                      key={`file-${index}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        border: '1px solid #D1D5DB',
                        pr: 1,
                      }}
                    >
                      <img className="p-3" src="photoIcon.svg" alt="Photo Icon" />
                      <Typography variant="body2" sx={{ width: '60%', color: 'text.secondary' }}>
                        {file.name}
                      </Typography>
                      <IconButton
                        onClick={() => handleDeleteFile(index)}
                        sx={{ color: 'error.main', '&:hover': { color: 'error.dark' }, ml: 'auto', px: 1 }}
                        aria-label={`Delete file ${file.name}`}
                      >
                        <img src="deleteFileIcon.svg" alt="Delete File Icon" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                <FormControl>
                  <FormLabel htmlFor="uploadFile">
                    <img src="uploadButtonIcon.svg" alt="Upload Icon" />
                  </FormLabel>
                  <Input
                    id="uploadFile"
                    {...register('upload_file')}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={uploadOnChange}
                    sx={{ display: 'none' }}
                  />
                </FormControl>
              </Box>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: { xs: '90%', md: '55%' },
                  mt: 14,
                  mb: 3,
                  bgcolor: '#04B7B1',
                  color: 'white',
                  borderRadius: '4px',
                  textTransform: 'none',
                  py: 1.5,
                  '&:hover': { bgcolor: '#03A6A0' },
                }}
              >
                Submit Ticket
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MUIComplaintForm;
