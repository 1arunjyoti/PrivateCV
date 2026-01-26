import { View, Image, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/db";

interface PolishedSidebarProps {
  basics: Resume["basics"];
  children: React.ReactNode;
  themeColor: string;
}

export function PolishedSidebar({
  basics,
  children,
  themeColor,
}: PolishedSidebarProps) {
  const styles = StyleSheet.create({
    profileImageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      objectFit: "cover",
    },
  });

  return (
    <View>
      {basics.image && (
        <View style={styles.profileImageContainer}>
          <Image src={basics.image} style={styles.image} />
        </View>
      )}
      {children}
    </View>
  );
}
