import { MaintenanceTask } from '@/constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Card, Chip, Dialog, Divider, IconButton, Button as PaperButton, TextInput as PaperTextInput, Portal, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialTasks: (MaintenanceTask & { status: string; overdue: boolean })[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Replace HVAC Filter',
    description: 'Change the HVAC filter in the attic unit.',
    frequency: 'yearly',
    last_completed: '2024-05-01',
    next_due: '2024-11-01',
    notes: 'Changed filter in attic unit.',
    supply_links: ['https://www.example.com/hvac-filter'],
    created_at: '2024-01-01',
    updated_at: '2024-05-01',
    status: 'Completed',
    overdue: false,
    category: 'hvac',
    priority: 'medium',
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Clean Gutters',
    description: 'Remove leaves and debris from gutters.',
    frequency: 'quarterly',
    last_completed: '2023-10-01',
    next_due: '2024-04-01',
    notes: 'Leaves from last fall.',
    supply_links: [],
    created_at: '2023-01-01',
    updated_at: '2023-10-01',
    status: 'Overdue',
    overdue: true,
    category: 'landscaping',
    priority: 'low',
  },
];

function getSorted(tasks: typeof initialTasks) {
  return [...tasks].sort((a, b) => new Date(a.next_due).getTime() - new Date(b.next_due).getTime());
}

function getNextDueDate(lastCompleted: string, frequency: MaintenanceTask['frequency']): string {
  const date = new Date(lastCompleted);
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().slice(0, 10);
}

const categoryOptions = [
  { key: 'plumbing', label: 'Plumbing', icon: 'water-pump' },
  { key: 'electrical', label: 'Electrical', icon: 'flash' },
  { key: 'hvac', label: 'HVAC', icon: 'air-conditioner' },
  { key: 'landscaping', label: 'Landscaping', icon: 'tree' },
  { key: 'general', label: 'General Maintenance', icon: 'tools' },
  { key: 'automotive', label: 'Automotive', icon: 'car' },
];
const priorityOptions = [
  { key: 'low', label: 'Low Priority', color: '#B0BEC5' },
  { key: 'medium', label: 'Medium Priority', color: '#FFB300' },
  { key: 'high', label: 'High Priority', color: '#E57373' },
];
function getCategoryLabel(key: string | undefined): string {
  const found = categoryOptions.find((opt: { key: string }) => opt.key === key);
  return found && found.label ? found.label : '—';
}
function getPriorityLabel(key: string | undefined): string {
  const found = priorityOptions.find((opt: { key: string }) => opt.key === key);
  return found && found.label ? found.label : '—';
}
function getPriorityColor(key: string | undefined): string {
  const found = priorityOptions.find((opt: { key: string }) => opt.key === key);
  return found && found.color ? found.color : '#CFD8DC';
}
function getPriorityTextColor(key: string | undefined): string {
  if (key === 'high') return '#C62828';
  if (key === 'medium') return '#FF6F00';
  if (key === 'low') return '#37474F';
  return '#37474F';
}

export default function TasksScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof initialTasks[0] | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    notes: '',
    frequency: 'monthly' as MaintenanceTask['frequency'],
    next_due: '',
    category: 'general',
    priority: 'medium',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openAddModal = () => {
    setEditingTask(null);
    setForm({ name: '', description: '', notes: '', frequency: 'monthly', next_due: '', category: 'general', priority: 'medium' });
    setModalVisible(true);
  };

  const openEditModal = (task: typeof initialTasks[0]) => {
    setEditingTask(task);
    setForm({
      name: task.name,
      description: task.description,
      notes: task.notes,
      frequency: task.frequency,
      next_due: task.next_due,
      category: task.category,
      priority: task.priority,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!frequencyOptions.includes(form.frequency)) {
      alert('Frequency must be one of: ' + frequencyOptions.join(', '));
      return;
    }
    if (editingTask) {
      setTasks(tasks => getSorted(tasks.map(t => t.id === editingTask.id ? { ...t, ...form } : t)));
    } else {
      const newTask = {
        id: Math.random().toString(36).slice(2),
        user_id: 'user-1',
        name: form.name,
        description: form.description,
        frequency: form.frequency,
        last_completed: '',
        next_due: form.next_due,
        notes: form.notes,
        supply_links: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: '',
        overdue: false,
        category: form.category,
        priority: form.priority,
      };
      setTasks(tasks => getSorted([...tasks, newTask]));
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  };

  const handleMarkComplete = (id: string) => {
    setTasks(tasks => getSorted(tasks.map(t => {
      if (t.id === id) {
        const today = new Date().toISOString().slice(0, 10);
        return {
          ...t,
          last_completed: today,
          next_due: getNextDueDate(today, t.frequency),
          status: 'Completed',
          overdue: false,
        };
      }
      return t;
    })));
  };

  const isTaskComplete = (task: typeof initialTasks[0]) => !!task.last_completed && task.status === 'Completed';

  const handleMarkIncomplete = (id: string) => {
    setTasks(tasks => getSorted(tasks.map(t => {
      if (t.id === id) {
        // Remove last_completed, set status/overdue based on due date
        const overdue = new Date(t.next_due) < new Date();
        return {
          ...t,
          last_completed: '',
          status: overdue ? 'Overdue' : 'Pending',
          overdue,
        };
      }
      return t;
    })));
  };

  const frequencyOptions: MaintenanceTask['frequency'][] = ['weekly', 'monthly', 'quarterly', 'yearly'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Content title="Maintenance Tasks" titleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold', fontSize: 22 }} />
      </Appbar.Header>
      <Surface style={styles.container}>
        <PaperButton mode="contained" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); openAddModal(); }} style={[styles.addButton, { backgroundColor: theme.colors.primary }]} contentStyle={{ paddingVertical: 6 }}>
          Add Task
        </PaperButton>
        <FlatList
          data={getSorted(tasks)}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => {
            const completed = isTaskComplete(item);
            const icon = categoryOptions.find(opt => opt.key === (item.category || ''))?.icon;
            return (
              <Card style={[styles.task, item.overdue && styles.overdue, completed && styles.completed, { backgroundColor: theme.colors.surface }]}>
                <TouchableRipple onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); openEditModal(item); }} borderless style={{ borderRadius: 22 }}>
                  <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons
                      name={completed ? 'circle' : 'checkbox-blank-circle-outline'}
                      size={28}
                      color={completed ? '#43e97b' : '#B0BEC5'}
                      style={{ marginRight: 12 }}
                    />
                    <Surface style={{ flex: 1, backgroundColor: 'transparent', elevation: 0, shadowColor: 'transparent' }}>
                      <Text
                        variant="titleMedium"
                        style={[
                          styles.taskTitle,
                          {
                            color: completed ? 'rgba(60,60,67,0.4)' : theme.colors.onSurface,
                            textDecorationLine: completed ? 'line-through' : 'none',
                          },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Surface style={styles.chipRow}>
                        <Chip style={[styles.chip, { backgroundColor: theme.colors.secondary }]} icon={icon ? icon : ''} textStyle={[styles.chipLabel, { color: theme.colors.onSecondary }]} ellipsizeMode="tail">{getCategoryLabel(item.category || '')}</Chip>
                        <Chip style={[styles.chip, { backgroundColor: getPriorityColor(item.priority || '') }]} textStyle={[styles.chipLabel, { color: getPriorityTextColor(item.priority || '') }]} ellipsizeMode="tail">{getPriorityLabel(item.priority || '')}</Chip>
                        <Chip style={[styles.chip, { backgroundColor: theme.colors.elevation.level1 }]} textStyle={[styles.chipLabel, { color: theme.colors.primary }]} icon="clock-outline" ellipsizeMode="tail">Due {item.next_due ? new Date(item.next_due).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Chip>
                      </Surface>
                      <Divider style={styles.chipDivider} />
                      {completed && (
                        <Surface style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: 'transparent', elevation: 0, shadowColor: 'transparent' }}>
                          <MaterialCommunityIcons name="check-circle" size={18} color="#43e97b" style={{ marginRight: 4 }} />
                          <Text style={{ color: '#43e97b', fontSize: 15, fontWeight: 'bold' }}>
                            Completed {item.last_completed ? new Date(item.last_completed).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                          </Text>
                          <MaterialCommunityIcons name="star-four-points-outline" size={16} color="#43e97b" style={{ marginLeft: 4 }} />
                        </Surface>
                      )}
                    </Surface>
                    <IconButton icon="trash-can-outline" size={24} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); handleDelete(item.id); }} iconColor="#90A4AE" style={styles.deleteIcon} />
                  </Card.Content>
                </TouchableRipple>
              </Card>
            );
          }}
        />
        <Portal>
          <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.dialog}>
            <Dialog.Title>Create New Task</Dialog.Title>
            <Dialog.Content>
              <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
                <Text style={[{ color: '#888' }, styles.modalField]}>Add a new home maintenance task to your list</Text>
                <Text style={[styles.label, styles.modalField]}>Task Title *</Text>
                <PaperTextInput
                  style={[styles.input, styles.modalField]}
                  placeholder="e.g., Replace HVAC filters"
                  value={form.name}
                  onChangeText={text => setForm(f => ({ ...f, name: text }))}
                  returnKeyType="next"
                  mode="outlined"
                />
                <Text style={[styles.label, styles.modalField]}>Description</Text>
                <PaperTextInput
                  style={[styles.input, styles.modalField]}
                  placeholder="Add any additional details or notes..."
                  value={form.description}
                  onChangeText={text => setForm(f => ({ ...f, description: text }))}
                  returnKeyType="next"
                  mode="outlined"
                  multiline
                />
                <Text style={[styles.label, styles.modalField]}>Category *</Text>
                <Surface style={[{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'transparent', elevation: 0, marginBottom: 12 }, styles.modalField]}>
                  {categoryOptions.map(opt => (
                    <Chip
                      key={opt.key}
                      icon={opt.icon as any}
                      selected={form.category === opt.key}
                      onPress={() => setForm(f => ({ ...f, category: opt.key }))}
                      style={{ marginRight: 8, marginBottom: 8, backgroundColor: form.category === opt.key ? '#1976D2' : '#f0f0f0' }}
                      textStyle={{ color: form.category === opt.key ? 'white' : '#222', fontWeight: 'bold' }}
                    >
                      {opt.label}
                    </Chip>
                  ))}
                </Surface>
                <Text style={[styles.label, styles.modalField]}>Priority</Text>
                <Surface style={[{ flexDirection: 'row', backgroundColor: 'transparent', elevation: 0, marginBottom: 12 }, styles.modalField]}>
                  {priorityOptions.map(opt => (
                    <Chip
                      key={opt.key}
                      selected={form.priority === opt.key}
                      onPress={() => setForm(f => ({ ...f, priority: opt.key }))}
                      style={{
                        marginRight: 8,
                        backgroundColor: form.priority === opt.key ? opt.color : '#f0f0f0',
                        borderColor: opt.color,
                        borderWidth: 1,
                      }}
                      textStyle={{ color: form.priority === opt.key ? 'white' : opt.color, fontWeight: 'bold' }}
                    >
                      {opt.label}
                    </Chip>
                  ))}
                </Surface>
                <Text style={[styles.label, styles.modalField]}>Due Date *</Text>
                <TouchableRipple onPress={() => setShowDatePicker(true)} style={[{ borderRadius: 8 }, styles.modalField]}>
                  <PaperTextInput
                    style={[styles.input]}
                    placeholder="mm/dd/yyyy"
                    value={form.next_due ? new Date(form.next_due).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    mode="outlined"
                    editable={false}
                    right={<PaperTextInput.Icon icon="calendar" />}
                    pointerEvents="none"
                  />
                </TouchableRipple>
                {showDatePicker && (
                  <DateTimePicker
                    value={form.next_due ? new Date(form.next_due) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) {
                        setForm(f => ({ ...f, next_due: date.toISOString().slice(0, 10) }));
                      }
                    }}
                  />
                )}
                <Text style={[styles.label, styles.modalField]}>Notes</Text>
                <PaperTextInput
                  style={[styles.input, styles.modalField]}
                  placeholder="Notes"
                  value={form.notes}
                  onChangeText={text => setForm(f => ({ ...f, notes: text }))}
                  returnKeyType="done"
                  mode="outlined"
                  multiline
                />
                <Divider style={[{ marginVertical: 18 }, styles.modalField]} />
                <Text style={[styles.label, styles.modalField]}>Photo Attachment (coming soon)</Text>
                <Surface style={[styles.photoPlaceholder, { backgroundColor: theme.colors.elevation.level1 }]}>
                  <Text style={{ color: theme.colors.onSurfaceVariant }}>No photo</Text>
                </Surface>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton
                mode="contained"
                onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); handleSave(); }}
                style={[{ marginTop: 16, borderRadius: 8 }, styles.modalField]}
                contentStyle={{ paddingVertical: 8 }}
                labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
              >
                Create Task
              </PaperButton>
              <PaperButton mode="text" onPress={() => setModalVisible(false)} style={[{ marginTop: 4 }, styles.modalField]}>
                Cancel
              </PaperButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  addButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  task: {
    borderRadius: 22,
    marginBottom: 22,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    elevation: 3,
  },
  overdue: {
    borderColor: 'red',
    borderWidth: 2,
  },
  completed: {
    backgroundColor: '#E6FAF0',
    borderColor: '#B2F2D7',
    borderWidth: 1,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    height: 28,
    backgroundColor: '#C8F7DC',
    flexShrink: 1,
    minWidth: 0,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    marginBottom: 12,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    maxHeight: '90%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
    gap: 8, // for consistent spacing between chips
  },
  deleteIcon: {
    marginLeft: 4,
    alignSelf: 'center',
  },
  taskTitle: {
    fontWeight: 'bold',
    color: '#222',
    textDecorationLine: undefined, // will be overridden if completed
    marginBottom: 2,
  },
  chipLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  chipDivider: {
    marginBottom: 4,
    opacity: 0.15,
  },
  modalField: {
    marginBottom: 14,
  },
  actionDivider: {
    marginBottom: 16,
    marginTop: 8,
    opacity: 0.18,
  },
  photoPlaceholder: {
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    padding: 12,
  },
  dialog: {
    maxHeight: '90%',
  },
}); 