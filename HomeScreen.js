import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button, TextInput, TouchableOpacity } from 'react-native';
import { Appbar, Menu, Provider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import axios from 'axios';

const HomeScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://192.168.1.6:5000/students');
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Lỗi khi lấy dữ liệu sinh viên.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://192.168.1.6:5000/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error(error);
      setError('Lỗi khi xóa sinh viên.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const sortStudents = (students) => {
    switch (sortOrder) {
      case 'name-asc':
        return [...students].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...students].sort((a, b) => b.name.localeCompare(a.name));
      case 'age-asc':
        return [...students].sort((a, b) => a.age - b.age);
      case 'age-desc':
        return [...students].sort((a, b) => b.age - a.age);
      default:
        return students;
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      <LinearGradient colors={['#c2add8', '#233350']} style={styles.gradient}>
        <Appbar style={styles.appbar}>
          <Appbar.Content title="Quản lý Sinh viên" />
        </Appbar>
        <View style={styles.searchSortContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sinh viên"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={styles.sortButton}>
                <Text style={styles.sortText}>Sắp xếp</Text>
              </TouchableOpacity>
            }>
            <Menu.Item onPress={() => { setSortOrder('name-asc'); closeMenu(); }} title="Tên A-Z" />
            <Menu.Item onPress={() => { setSortOrder('name-desc'); closeMenu(); }} title="Tên Z-A" />
            <Menu.Item onPress={() => { setSortOrder('age-asc'); closeMenu(); }} title="Tuổi Tăng" />
            <Menu.Item onPress={() => { setSortOrder('age-desc'); closeMenu(); }} title="Tuổi Giảm" />
          </Menu>
        </View>
        <Button title={isFormVisible ? "Ẩn Form" : "Thêm Sinh Viên"} onPress={toggleForm} />
        {isFormVisible && <StudentForm fetchStudents={fetchStudents} />}
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <StudentList 
            students={sortStudents(filteredStudents)} 
            handleDelete={handleDelete} 
            fetchStudents={fetchStudents} // Đảm bảo fetchStudents được truyền đúng
            loading={loading} 
          />
        )}
      </LinearGradient>
    </Provider>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  appbar: {
    backgroundColor: 'transparent',
  },
  searchSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  searchInput: {
    flex: 3,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginRight: 8,
  },
  sortButton: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  sortText: {
    color: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
