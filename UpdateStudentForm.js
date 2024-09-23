import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const UpdateStudentForm = ({ student, fetchStudents, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        if (student) {
            setName(student.name);
            setEmail(student.email);
            setAge(student.age.toString());
        }
    }, [student]);

    const handleUpdate = async () => {
        // Kiểm tra điều kiện hợp lệ
        if (!name || !email || !age) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Email không hợp lệ.');
            return;
        }

        // Kiểm tra độ tuổi (phải là số và lớn hơn 0)
        if (isNaN(age) || Number(age) <= 0) {
            alert('Tuổi phải là một số lớn hơn 0.');
            return;
        }

        try {
            const response = await fetch(`http://192.168.1.6:5000/students/${student._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, age: Number(age) }),
            });
            if (response.ok) {
                await fetchStudents();
                onClose();
            } else {
                alert('Cập nhật không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sinh viên:', error);
            alert('Lỗi khi cập nhật sinh viên');
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
            />
            <TextInput
                placeholder="Tuổi"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <Button title="Cập nhật" onPress={handleUpdate} />
                <Button title="Hủy" onPress={onClose} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default UpdateStudentForm;
