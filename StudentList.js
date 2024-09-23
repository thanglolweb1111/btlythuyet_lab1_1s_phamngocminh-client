import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity, Linking, Modal } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UpdateStudentForm from './UpdateStudentForm';

const StudentList = ({ students, loading, handleDelete, fetchStudents }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Hàm xác nhận trước khi xóa
    const confirmDelete = (id) => {
        Alert.alert(
            'Xóa sinh viên',
            'Bạn có chắc chắn muốn xóa sinh viên này không?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', onPress: () => handleDelete(id), style: 'destructive' }
            ]
        );
    };

    // Hàm mở ứng dụng email với địa chỉ và nội dung đã định sẵn
    const handleEmailPress = (email) => {
        const subject = encodeURIComponent("Chào bạn!");
        const body = encodeURIComponent("Xin chào, tôi xin được phép làm quen với bạn.");
        Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
    };

    return (
        <View style={styles.listContainer}>
            <FlatList
                data={students}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <LinearGradient
                            colors={['#eba480', '#ef8688']}
                            style={styles.gradientBackground}
                        >
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>Tên: {item.name}</Text>
                                    <View style={styles.iconContainer}>
                                        <TouchableOpacity onPress={() => confirmDelete(item._id)} style={styles.iconWrapper}>
                                            <Ionicons name="trash-bin" size={28} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { setSelectedStudent(item); setModalVisible(true); }} style={styles.iconWrapper}>
                                            <Ionicons name="pencil" size={28} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.emailContainer} onPress={() => handleEmailPress(item.email)}>
                                    <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                                    <Text style={styles.cardText}>Email: {item.email}</Text>
                                </TouchableOpacity>
                                <Text style={styles.cardText}>Tuổi: {item.age}</Text>
                            </Card.Content>
                        </LinearGradient>
                    </Card>
                )}
            />
            <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalContainer}>
        <UpdateStudentForm
            student={selectedStudent}
            fetchStudents={fetchStudents} // Đảm bảo fetchStudents được truyền đúng
            onClose={() => setModalVisible(false)}
        />
    </View>
</Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    card: {
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 10,
        overflow: 'hidden',
    },
    gradientBackground: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 50,
        padding: 8,
        marginLeft: 10,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    cardText: {
        color: '#fff',
        marginLeft: 5,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
});

export default StudentList;
