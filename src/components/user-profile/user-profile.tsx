import styles from './user-profile.module.css';

interface UserProfileProps {
  name: string;
  email: string;
}

export function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div className={styles.root}>
      <div className={styles.avatar} aria-hidden="true" />
      <div className={styles.textGroup}>
        <p className={styles.name}>{name}</p>
        <p className={styles.email}>{email}</p>
      </div>
    </div>
  );
}
