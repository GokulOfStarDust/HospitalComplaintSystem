import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance'; 
import handleQRCodePrint, { QRCodePrinter } from '../PrintQRCode';
import DeleteIcon from '../../assets/images/deleteIcon.jpg';
import EditIcon from '../../assets/images/editIcon.jpg';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import { BASE_URL, ROOMS_URL } from '../Url';

function MUIBedConfiguration() {
  const [roomQR, setRoomQRCode] = useState([]);
  const [tableContent, setTableContent] = useState({ results: [], count: 0 });
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isEditable, setIsEditable] = useState(false);
  const [idToEdit, setIdToEdit] = useState(null);
  const [masterChecked, setMasterChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const response = await axiosInstance({
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
        offset: pageNumber * pageSize,
      };

      const response = await axiosInstance.get(`${BASE_URL}${ROOMS_URL}`, { params });
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
        const existingIds = new Set(prev.map((item) => item.id));
        const newData = dataForQr.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newData];
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching rows:', error.response?.statusText || error.message);
      setTableContent({ results: [], count: 0 });
      setIsLoading(false);
    }
  };

  const deleteRows = async (id) => {
    try {
      await axiosInstance.delete(`${BASE_URL}${ROOMS_URL}${id}/`);
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

  const columns = [
    {
      field: 'toPrint',
      headerName: '',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      flex: 1.5,
      minWidth: 50,
      filterable: false, // Disable filter option for this column
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
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
      ),
      renderCell: (params) => (
        <Checkbox
          checked={!!roomQR?.find((item) => item?.id === params.row.id)?.toPrint}
          onChange={() => {
            if (params.row.status === 'active') {
              const updated = roomQR.map((item) =>
                item?.id === params.row.id ? { ...item, toPrint: !item.toPrint } : item
              );
              setRoomQRCode(updated);
              if (!updated.find((item) => item?.id === params.row.id)?.toPrint) {
                setMasterChecked(false);
              }
            }
          }}
          sx={{ color: '#04B7B1', '&.Mui-checked': { color: '#04B7B1' }, transform: 'scale(0.9)' }}
        />
      ),
    },
    { field: 'bed_no', headerName: 'Bed No', flex: 1.5, minWidth: 100 },
    { field: 'room_no', headerName: 'Room No', flex: 1.5, minWidth: 130 },
    { field: 'Block', headerName: 'Block', flex: 1.5, minWidth: 100 },
    { field: 'Floor_no', headerName: 'Floor', flex: 1.5, minWidth: 100 },
    { field: 'ward', headerName: 'Ward', flex: 1.5, minWidth: 150 },
    { field: 'speciality', headerName: 'Speciality', flex: 1.5, minWidth: 150 },
    { field: 'room_type', headerName: 'Room Type', flex: 1.5, minWidth: 150 },
    { field: 'status', headerName: 'Status', flex: 1.5, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center justify-start gap-x-2">
          <IconButton
            onClick={() => {
              setIsEditable(true);
              reset({
                bed_no: params.row.bed_no,
                room_no: params.row.room_no,
                Floor_no: params.row.Floor_no,
                Block: params.row.Block,
                room_type: params.row.room_type,
                speciality: params.row.speciality,
                ward: params.row.ward,
                status: params.row.status === 'active',
              });
              setIdToEdit(params.row.id);
            }}
            sx={{ padding: 0 }}
          >
            <img src={EditIcon} alt="Edit" className="size-8 flex-shrink-0 hover:cursor-pointer" />
          </IconButton>
          <IconButton onClick={() => deleteRows(params.row.id)} sx={ { padding: 0 }}>
            <img src={DeleteIcon} alt="Delete" className="size-8 flex-shrink-0 hover:cursor-pointer" />
          </IconButton>
          <IconButton
            onClick={(event) => handleMenuClick(event, params.row.id)}
            size="small"
            sx={{ padding: 0 }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRowId === params.row.id}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MuiMenuItem onClick={handleMenuClose}>History</MuiMenuItem>
            <MuiMenuItem
              onClick={() => {
                handleQRCodePrint([{ id: params.row.id, qrCodeUrl: params.row.qr_code, toPrint: true }]);
                handleMenuClose();
              }}
            >
              Print QR Code
            </MuiMenuItem>
          </MuiMenu>
        </div>
      ),
    },
  ];

  return (
    <main className="h-[97%] w-full flex flex-row gap-x-4 justify-between items-center p-5 pt-10">
      <section className="w-[70%] h-[80vh] flex flex-col justify-start rounded-xl bg-white">
        <QRCodePrinter roomQR={roomQR} />
        <DataGrid
          rows={tableContent.results}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          rowCount={tableContent.count}
          rowHeight={64}
          loading={isLoading}
          paginationMode="server"
          paginationModel={{ page: pageNumber, pageSize }}
          onPaginationModelChange={(newModel) => {
            setPageNumber(newModel.page);
            setPageSize(newModel.pageSize);
          }}
          sx={{
            height: '100%',
            width: '100%',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#616161',
              color: '#616161',
              fontSize: '0.875rem',
              fontWeight: 'medium',
            },
            '& .MuiDataGrid-cell': {
              padding: '1rem 0.75rem',
              fontSize: '0.875rem',
              color: '#616161',
              display: 'flex',
              alignItems: 'center',
            },
            
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#FAF9F9',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#FAF9F9',
              justifyContent: 'flex-end',
            },
          }}
          disableRowSelectionOnClick
        />
      </section>

      <section className="flex flex-col justify-start w-[30%] h-[80vh] bg-white rounded-xl">
        <div className="flex flex-col bg-[#FAF9F9] py-3 px-4 rounded-t-xl">
          <p className="font-sans text-secondary">Bed Configuration</p>
        </div>
        <div className="p-4">
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
        <div className="flex flex-row items-center justify-center gap-x-2 bg-[#FAF9F9] p-2 mt-auto rounded-b-xl">
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
              color: '#FFFFFF',
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