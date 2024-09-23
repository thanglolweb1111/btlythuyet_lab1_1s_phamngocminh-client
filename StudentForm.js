    import React, { useState } from 'react';
    import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
    import axios from 'axios';

    const StudentForm = ({ fetchStudents }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    const validateInput = () => {
        if (!name.trim() || !email.trim() || !age.trim()) {
            Alert.alert('Lỗi', 'Không được để trống trường nào.');
            return false;
        }

        const nameRegex = /^[A-Za-zÀÁÂÃÈÊÌÍÒÓÔÕÙÚÀÁÀĐÌÙƠƯ]+( [A-Za-zÀÁÂÃÈÊÌÍÒÓÔÕÙÚÀÁÀĐÌÙƠƯ]+)*$/;
        if (!nameRegex.test(name)) {
            Alert.alert('Lỗi', 'Tên chỉ được chứa chữ cái.');
            return false;
        }

        const emailRegex = /^\S+@\S+\.\S+$/; // Kiểm tra định dạng email
        if (!emailRegex.test(email)) {
            Alert.alert('Lỗi', 'Địa chỉ email không hợp lệ.');
            return false;
        }

        const ageNumber = parseInt(age, 10);
        if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 1000) {
            Alert.alert('Lỗi', 'Tuổi phải là số từ 1 đến 1000.');
            return false;
        }
    
        return true;
    };
    
    const handleSubmit = async () => {
        if (!validateInput()) return; // Kiểm tra dữ liệu trước khi gửi
        try {
        await axios.post('http://192.168.1.6:5000/students', { name, email, age });
        fetchStudents(); // Lấy lại danh sách sinh viên
        setName('');
        setEmail('');
        setAge('');
        } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể thêm sinh viên.');
        }
    };

    return (
        <View style={styles.formContainer}>
        <TextInput
            placeholder="Tên"
            value={name}
            onChangeText={setName}
            style={styles.input}
        />
        <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
        />
        <TextInput
            placeholder="Tuổi"
            value={age}
            onChangeText={setAge}
            style={styles.input}
            keyboardType="numeric"
        />
        <Button title="Thêm Sinh Viên" onPress={handleSubmit} />
        </View>
    );
    };

    const styles = StyleSheet.create({
    formContainer: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    });

    export default StudentForm;
