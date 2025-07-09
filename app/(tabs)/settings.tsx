import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Divider, Surface, Text } from 'react-native-paper';

export default function SettingsScreen() {
  return (
    <Surface style={styles.container}>
      <Text variant="headlineLarge" style={styles.header}>Settings</Text>

      <Surface style={styles.section} elevation={1}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Authentication</Text>
        <Divider style={styles.sectionDivider} />
        <Button mode="contained" style={styles.fullWidthButton} onPress={() => {}}>Log In</Button>
        <Button mode="contained" style={styles.fullWidthButton} onPress={() => {}}>Log Out</Button>
      </Surface>

      <Divider style={styles.divider} />

      <Surface style={styles.section} elevation={1}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Data</Text>
        <Divider style={styles.sectionDivider} />
        <Button mode="contained" style={styles.fullWidthButton} onPress={() => {}}>Export to CSV</Button>
      </Surface>

      <Divider style={styles.divider} />

      <Surface style={styles.section} elevation={1}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Other Settings</Text>
        <Divider style={styles.sectionDivider} />
        <Button mode="contained" style={styles.fullWidthButton} onPress={() => {}}>Notification Preferences</Button>
        <Button mode="contained" style={styles.fullWidthButton} onPress={() => {}}>Theme</Button>
        <Button mode="contained" style={styles.fullWidthButton} onPress={() => {}}>About</Button>
      </Surface>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 28, // slightly increased for more separation
    padding: 20, // more padding for content
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 8,
  },
  sectionDivider: {
    marginBottom: 16,
  },
}); 