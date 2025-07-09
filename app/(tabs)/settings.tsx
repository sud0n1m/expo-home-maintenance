import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Divider, Surface, Text, TextInput } from 'react-native-paper';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Create a separate client with service key for admin operations
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

export default function SettingsScreen() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setEmail(user.email);
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
        setUserId(user.id);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!email.trim()) return;
    console.log('Starting user save process for email:', email);
    setLoading(true);
    
    // Skip authentication for now - will need to handle RLS policy differently
    console.log('Proceeding without authentication (RLS policy may need adjustment)');
    
    // Check if user exists in Supabase
    let id = userId;
    let user;
    console.log('Checking if user exists for email:', email);
    const { data: existing, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetchError:', fetchError);
      setLoading(false);
      alert('Failed to fetch user data.');
      return;
    }
    
    if (existing) {
      console.log('Found existing user:', existing);
      id = existing.id;
      user = existing;
    } else {
      console.log('User not found, creating new user with data:', { email, first_name: firstName, last_name: lastName });
      
      // Use direct REST API call that matches your working CURL command
      const userData = { email, first_name: firstName, last_name: lastName };
      console.log('Making direct REST API call...');
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('REST API error:', response.status, errorText);
          setLoading(false);
          alert('Failed to save user.');
          return;
        }
        
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        let inserted;
        if (responseText.trim()) {
          try {
            inserted = JSON.parse(responseText);
            console.log('REST API success:', inserted);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.log('Raw response:', responseText);
          }
        } else {
          console.log('Empty response - this is normal for POST requests');
          // For 201 responses, we can assume success and create a user object
          inserted = { id: Date.now(), email, first_name: firstName, last_name: lastName };
        }
        
        if (inserted) {
          console.log('Successfully created new user:', inserted);
          id = inserted.id;
          user = inserted;
        } else {
          console.error('Insert operation returned no data');
          setLoading(false);
          alert('Failed to save user.');
          return;
        }
      } catch (error) {
        console.error('Network error:', error);
        setLoading(false);
        alert('Failed to save user.');
        return;
      }
    }
    // Store locally
    console.log('Storing user data locally:', user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUserId(id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    // Identify with Customer.io
    console.log('Identifying with Customer.io, user ID:', id);
    import('customerio-reactnative').then(({ CustomerIO }) => {
      CustomerIO.identify({
        userId: String(id),
        traits: { email, first_name: firstName, last_name: lastName },
      });
      console.log('Customer.io identification complete');
    });
    
    console.log('User save process completed successfully');
    setLoading(false);
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineLarge" style={styles.header}>Settings</Text>

      <Surface style={styles.section} elevation={1}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Authentication</Text>
        <Divider style={styles.sectionDivider} />
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={{ marginBottom: 12 }}
        />
        <Button mode="contained" style={styles.fullWidthButton} onPress={handleSave} loading={loading} disabled={!email.trim()}>
          Save
        </Button>
        {saved && <Text style={{ color: 'green', marginTop: 8 }}>Saved!</Text>}
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