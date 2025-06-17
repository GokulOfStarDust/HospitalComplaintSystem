import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import handleQRCodePrint, { QRCodePrinter } from './PrintQRCode';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Typography,
} from '@mui/material';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import { BASE_URL, ROOMS_URL } from './Url';

function MUIBedConfiguration() {
  const [roomQR, setRoomQRCode] = useState([]);
  const [tableContent, setTableContent] = useState({ results: [], count: 0 });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEditable, setIsEditable] = useState(false);
  const [idToEdit, setIdToEdit] = useState(null);
  const [masterChecked, setMasterChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const defaultValues = {
    bed_no: '',
    room_no: '',
    Floor_no: '',
    Block: '',
    room_type: '',
    speciality: '',
    ward: '',
    status: false,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    console.log('Table content updated:', tableContent);
  }, [tableContent]);

  const formDataHandler = async (data) => {
    const METHOD = isEditable ? 'put' : 'post';
    const url = isEditable ? `${BASE_URL}${ROOMS_URL}${idToEdit}/` : `${BASE_URL}${ROOMS_URL}`;
    data.status = data.status ? 'active' : 'inactive';

    try {
      const response = await axios({
        method: METHOD,
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (isEditable) {
        setRoomQRCode((prev) =>
          prev.map((item) =>
            item.id === idToEdit
              ? { ...item, qrCodeUrl: response.data.qr_code, toPrint: false, status: response.data.status }
              : item
          )
        );
      }
      fetchRows();
      setIdToEdit(null);
      setIsEditable(false);
      reset(defaultValues);
    } catch (error) {
      console.error('Error:', error.response?.statusText || error.message);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [pageNumber, pageSize]);

  const fetchRows = async () => {
    try {
      const params = {
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      };

      const response = await axios.get(`${BASE_URL}${ROOMS_URL}`, { params });
      const data = response.data || { results: [], count: 0 };
      setTableContent({
        results: data.results || [],
        count: data.count || 0,
      });

      const dataForQr = (data.results || []).map((prop) => ({
        id: prop.id,
        qrCodeUrl: prop.qr_code,
        toPrint: false,
        status: prop.status,
      }));

      setRoomQRCode((prev) => {
        // Remove duplicates by ID
        const existingIds = new Set(prev.map((item) => item.id));
        const newData = dataForQr.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newData];
      });
    } catch (error) {
      console.error('Error fetching rows:', error.response?.statusText || error.message);
      setTableContent({ results: [], count: 0 });
    }
  };

  const deleteRows = async (id) => {
    try {
      await axios.delete(`${BASE_URL}${ROOMS_URL}${id}/`);
      setRoomQRCode((prev) => prev.filter((item) => item?.id !== id));
      setTableContent((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.id !== id),
        count: prev.count - 1,
      }));
    } catch (error) {
      console.error('Error deleting row:', error.response?.statusText || error.message);
    }
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(tableContent.count / pageSize));

  return (
    <main className="h-svh flex flex-row gap-x-4 justify-between items-center">
      <section className="w-[70%] h-[85vh] flex flex-col justify-start rounded-xl bg-white">
        <QRCodePrinter roomQR={roomQR} />
        <TableContainer component={Paper} sx={{ height: '85vh', width: '100%' }}>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <TableRow sx={{ backgroundColor: '#FAF9F9', height: '50px' }}>
                <TableCell
                  sx={{
                    padding: '0 0.75rem',
                    width: '100px',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    color: '#616161',
                    borderRight: 'none',
                  }}
                >
                  <Checkbox
                    checked={masterChecked}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setMasterChecked(isChecked);
                      const updatedRoomQR = roomQR.map((item) => ({
                        ...item,
                        toPrint: isChecked && item.status === 'active',
                      }));
                      setRoomQRCode(updatedRoomQR);
                    }}
                    sx={{ color: '#04B7B1', '&.Mui-checked': { color: '#04B7B1' }, transform: 'scale(1)' }}
                  />
                </TableCell>
                <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                  Bed No
                </TableCell>
                <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                  Room No
                </TableCell>
                <TableCell
                  sx={{
                    padding: '0 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    color: '#616161',
                    width: '96px',
                  }}
                >
                  Block
                </TableCell>
                <TableCell
                  sx={{
                    padding: '0 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    color: '#616161',
                    width: '80px',
                  }}
                >
                  Floor
                </TableCell>
                <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                  Ward
                </TableCell>
                <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                  Speciality
                </TableCell>
                <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                  Room Type
                </TableCell>
                <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 'medium', color: '#616161' }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    padding: '0 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    color: '#616161',
                    borderLeft: 'none',
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(tableContent.results) &&
                tableContent.results.map((record) => (
                  <TableRow key={record.id} sx={{ '&:hover': { backgroundColor: '#FAF9F9' }, height: '6.7vh' }}>
                    <TableCell sx={{ padding: '0 0.75rem', width: '100px', borderRight: 'none' }}>
                      <Checkbox
                        checked={!!roomQR?.find((item) => item?.id === record.id)?.toPrint}
                        onChange={() => {
                          if (record.status === 'active') {
                            const updated = roomQR.map((item) =>
                              item?.id === record.id ? { ...item, toPrint: !item.toPrint } : item
                            );
                            setRoomQRCode(updated);
                            if (!updated.find((item) => item?.id === record.id)?.toPrint) {
                              setMasterChecked(false);
                            }
                          }
                        }}
                        sx={{ color: '#04B7B1', '&.Mui-checked': { color: '#04B7B1' }, transform: 'scale(0.9)' }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.bed_no}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.room_no}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.Block}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.Floor_no}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.ward}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.speciality}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.room_type}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', fontSize: '0.875rem', color: '#616161' }}>
                      {record.status}
                    </TableCell>
                    <TableCell sx={{ padding: '0 0.75rem', color: '#616161', borderLeft: 'none' }}>
                      <div className="flex items-center justify-start gap-x-2">
                        <IconButton
                          onClick={() => {
                            setIsEditable(true);
                            reset({
                              bed_no: record.bed_no,
                              room_no: record.room_no,
                              Floor_no: record.Floor_no,
                              Block: record.Block,
                              room_type: record.room_type,
                              speciality: record.speciality,
                              ward: record.ward,
                              status: record.status === 'active',
                            });
                            setIdToEdit(record.id);
                          }}
                          sx={{ padding: 0 }}
                        >
                          <img src="editIcon.jpg" alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                        </IconButton>
                        <IconButton onClick={() => deleteRows(record.id)} sx={{ padding: 0 }}>
                          <img src="deleteIcon.jpg" alt="Delete" className="size-8 flex-shrink-0 hover:cursor-pointer" />
                        </IconButton>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, record.id)}
                          size="small"
                          sx={{ padding: 0 }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                        <MuiMenu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedRowId === record.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <MuiMenuItem onClick={handleMenuClose}>History</MuiMenuItem>
                          <MuiMenuItem
                            onClick={() => {
                              handleQRCodePrint([{ id: record.id, qrCodeUrl: record.qr_code, toPrint: true }]);
                              handleMenuClose();
                            }}
                          >
                            Print QR Code
                          </MuiMenuItem>
                        </MuiMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {Array(pageSize - (tableContent.results?.length || 0)).fill(null).map((_, i) => (
                <TableRow key={`empty-${i}`} sx={{ height: '6.7vh' }}>
                  <TableCell sx={{ padding: '0 0.75rem', borderRight: 'none' }}> </TableCell>
                  {Array(8).fill(null).map((_, idx) => (
                    <TableCell key={idx} sx={{ padding: '0 0.75rem' }}> </TableCell>
                  ))}
                  <TableCell sx={{ padding: '0 0.75rem', borderLeft: 'none' }}> </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex flex-row justify-end items-center px-4 py-2 bg-[#FAF9F9]">
          <div className="mx-4 text-sm text-secondary">
            Page {pageNumber} of {totalPages}
          </div>
          <Button onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))} disabled={pageNumber === 1}>
            <img src="prevIcon.svg" alt="Previous" />
          </Button>
          <Button
            onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
            disabled={pageNumber === totalPages || tableContent.count === 0}
          >
            <img src="nextIcon.svg" alt="Next" />
          </Button>
        </div>
      </section>

      {/* Form section remains unchanged */}
      <section className="flex flex-col justify-between w-[30%] h-[95vh] bg-white rounded-xl">
        <div className="flex flex-col bg-[#FAF9F9] py-3 px-4 rounded-t-xl">
          <p className="font-sans text-secondary">Bed Configuration</p>
        </div>
        <div className="p-4 -mt-[390px]">
          <form id="bedForm" onSubmit={handleSubmit(formDataHandler)} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-0">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Bed No
              </Typography>
              <Controller
                name="bed_no"
                control={control}
                rules={{ required: 'Bed No is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.375rem', height: '5.2vh' } }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Room No
              </Typography>
              <Controller
                name="room_no"
                control={control}
                rules={{ required: 'Room No is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.375rem', height: '5.2vh' } }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Floor
              </Typography>
              <Controller
                name="Floor_no"
                control={control}
                rules={{ required: 'Floor is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth size="small" error={!!error}>
                    <Select
                      {...field}
                      variant="outlined"
                      sx={{ borderRadius: '0.375rem', height: '5.2vh' }}
                    >
                      <MenuItem value="" disabled></MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </Select>
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Block
              </Typography>
              <Controller
                name="Block"
                control={control}
                rules={{ required: 'Block is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth size="small" error={!!error}>
                    <Select
                      {...field}
                      variant="outlined"
                      sx={{ borderRadius: '0.375rem', height: '5.2vh' }}
                    >
                      <MenuItem value="" disabled></MenuItem>
                      <MenuItem value="Main">Main</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                    </Select>
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Speciality
              </Typography>
              <Controller
                name="speciality"
                control={control}
                rules={{ required: 'Speciality is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth size="small" error={!!error}>
                    <Select
                      {...field}
                      variant="outlined"
                      sx={{ borderRadius: '0.375rem', height: '5.2vh' }}
                    >
                      <MenuItem value="" disabled></MenuItem>
                      <MenuItem value="Cardiology">Cardiology</MenuItem>
                      <MenuItem value="Neurology">Neurology</MenuItem>
                      <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                      <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    </Select>
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Ward
              </Typography>
              <Controller
                name="ward"
                control={control}
                rules={{ required: 'Ward is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth size="small" error={!!error}>
                    <Select
                      {...field}
                      variant="outlined"
                      sx={{ height: '5.2vh', borderRadius: '0.375rem' }}
                    >
                      <MenuItem value="" disabled></MenuItem>
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Operation">Operation</MenuItem>
                      <MenuItem value="ICU">ICU</MenuItem>
                    </Select>
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Room Type
              </Typography>
              <Controller
                name="room_type"
                control={control}
                rules={{ required: 'Room Type is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth size="small" error={!!error}>
                    <Select
                      {...field}
                      variant="outlined"
                      sx={{ borderRadius: '0.375rem', height: '5.2vh' }}
                    >
                      <MenuItem value="" disabled></MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Costly">Costly</MenuItem>
                    </Select>
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Status
              </Typography>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        sx={{ color: '#04B7B1', '&.Mui-checked': { color: '#04B7B1' } }}
                      />
                    }
                    label="Active"
                    sx={{ marginLeft: '0.5rem' }}
                  />
                )}
              />
            </div>
          </form>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-2 bg-[#FAF9F9] p-2 rounded-b-xl">
          {isEditable ? (
            <Button
              variant="outlined"
              sx={{
                width: '20%',
                height: '4vh',
                textTransform: 'none',
                color: '#616161',
                borderColor: '#616161',
                '&:hover': { backgroundColor: '#E0E0E0', borderColor: '#616161' },
              }}
              onClick={() => {
                setIsEditable(false);
                setIdToEdit(null);
                reset(defaultValues);
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{
                width: '20%',
                height: '4vh',
                textTransform: 'none',
                color: '#616161',
                borderColor: '#616161',
                '&:hover': { backgroundColor: '#E0E0E0', borderColor: '#616161' },
              }}
              onClick={() => reset(defaultValues)}
            >
              Reset
            </Button>
          )}
          <Button
            type="submit"
            form="bedForm"
            variant="contained"
            sx={{
              width: '20%',
              height: '4vh',
              textTransform: 'none',
              backgroundColor: '#04B7B1',
              '&:hover': { backgroundColor: '#03A6A0' },
            }}
          >
            {isEditable ? 'Update' : 'Submit'}
          </Button>
        </div>
      </section>
    </main>
  );
}

export default MUIBedConfiguration;